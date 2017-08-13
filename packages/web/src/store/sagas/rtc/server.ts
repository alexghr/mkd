import { Effect, takeEvery, take, call, all, cancel, join, fork, select } from 'redux-saga/effects';
import { Channel, eventChannel, END } from 'redux-saga';

import { Slug, Document, Config } from '../../state';
import { ServerAction, DocumentAction } from '../../action';
import { getDocument, getConfig } from '../../selectors';

import Signal from '../../api/signal';
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

  const config: Config = yield select(getConfig);
  const signal = yield call(() => new Signal(config.signalUrl));
  const channel = yield call(createClientChannel, signal, slug);

  yield takeEvery(channel, connectToClient, signal, slug);
}

function* connectToClient(signal: Signal, slug: Slug, evt: ClientSignalEvent): Iterator<Effect | Array<Effect>> {
  const { clientId } = evt;
  const config: Config = yield select(getConfig);
  const rtcConn = yield call(rtcApi.createRTCConnection, config.stunServers);
  const dataChannel = yield call([rtcConn, rtcConn.createDataChannel], slug, {});

  const answerChannel = yield call(createRtcAnswerChannel, signal, slug, clientId);

  const [offer, candidates] = yield call(rtcApi.makeOffer, rtcConn);

  yield call([signal, signal.broadcast], slug, {
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
    const currentDocument = yield select(getDocument);

    yield call(
      [dataChannel, dataChannel.send],
      JSON.stringify(documentUpdateEvent(currentDocument))
    );
  } else {
    yield cancel();
  }
}

function createClientChannel(signal: Signal, slug: Slug): Channel<ClientSignalEvent> {
  return eventChannel(emitter => signal.listenForMessages(slug, evt => {
    if (isClientSignalEvent(evt)) {
      emitter(evt);
    }
  }));
}

function createRtcAnswerChannel(signal: Signal, slug: Slug, clientId: string): Channel<AnswerSignalEvent> {
  return eventChannel(emitter => signal.listenForMessages(slug, evt => {
    if (isAnswerSignalEvent(evt) && evt.clientId === clientId) {
      emitter(evt);
      emitter(END);
    }
  }));
}

function documentUpdateEvent(document: Document): DocumentUpdateEvent {
  return {
    type: DocumentUpdateEvent,
    document
  };
}
