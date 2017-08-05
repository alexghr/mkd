import { Effect, takeEvery, take, call, all, cancel, join, fork, select } from 'redux-saga/effects';
import { Channel, eventChannel, END } from 'redux-saga';

import { Slug, Document } from '../../state';
import { ServerAction, DocumentAction } from '../../action';
import { getDocument } from '../../selectors';

import * as signalhubApi from '../../api/signal';
import * as rtcApi from '../../api/rtc';

import {
  OfferSignalEvent, DocumentUpdateEvent,
  ClientSignalEvent, isClientSignalEvent,
  AnswerSignalEvent, isAnswerSignalEvent
} from './types';

export default function* serverSaga(): Iterator<Effect> {
  yield all([
    takeEvery(ServerAction.ListenForClients, listenForClients),
  ]);
}

function* listenForClients(action: ServerAction.ListenForClients): Iterator<Effect> {
  const { slug } = action.payload;
  const channel = yield call(createClientChannel, slug);

  yield takeEvery(channel, connectToClient, slug);
}

function* connectToClient(slug: Slug, evt: ClientSignalEvent): Iterator<Effect | Array<Effect>> {
  const { clientId } = evt;
  const rtcConn = yield call(rtcApi.createRTCConnection);
  const dataChannel = yield call([rtcConn, rtcConn.createDataChannel], slug, {});

  const answerChannel = yield call(createRtcAnswerChannel, slug, clientId);

  const [offer, candidates] = yield call(rtcApi.makeOffer, rtcConn);

  yield call(signalhubApi.broadcast, slug, {
      offer,
      candidates,
      clientId,
      type: OfferSignalEvent
  });

  const answerEvent: AnswerSignalEvent = yield take(answerChannel);

  yield join(
    yield fork(rtcApi.awaitDataChannelOpen, dataChannel),
    yield fork([rtcConn, rtcConn.setRemoteDescription], answerEvent.answer as RTCSessionDescription)
  );

  yield call(sendInitialDocument, dataChannel);
  yield takeEvery(DocumentAction.UpdateDocument, updateClient, dataChannel);
}

function* sendInitialDocument(dataChannel: RTCDataChannel): Iterator<Effect> {
  if (dataChannel.readyState !== 'open') {
    return;
  }

  const document = yield select(getDocument);
  yield call(
    [dataChannel, dataChannel.send],
    JSON.stringify(documentUpdateEvent(document))
  );
}

function* updateClient(
  dataChannel: RTCDataChannel, action: DocumentAction.UpdateDocument
): Iterator<Effect> {
  if (dataChannel.readyState === 'open') {
    yield call(
      [dataChannel, dataChannel.send],
      JSON.stringify(documentUpdateEvent(action.payload))
    );
  } else {
    yield cancel();
  }
}

function createClientChannel(slug: Slug): Channel<ClientSignalEvent> {
  return eventChannel(emitter => signalhubApi.listenForMessages(slug, evt => {
    if (isClientSignalEvent(evt)) {
      emitter(evt);
    }
  }));
}

function createRtcAnswerChannel(slug: Slug, clientId: string): Channel<AnswerSignalEvent> {
  return eventChannel(emitter => signalhubApi.listenForMessages(slug, evt => {
    if (isAnswerSignalEvent(evt) && evt.clientId === clientId) {
      emitter(evt);
      emitter(END);
    }
  }));
}

function documentUpdateEvent(document: Document): DocumentUpdateEvent {
  return {
    type: DocumentUpdateEvent,
    document: {
      slug: document.slug,
      text: document.text
    }
  };
}
