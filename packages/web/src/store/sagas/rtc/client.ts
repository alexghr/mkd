import { Effect, takeEvery, put, call, join, fork, all, select } from 'redux-saga/effects';
import { Channel, eventChannel, END } from 'redux-saga';

import { Slug, Config } from '../../state';
import { getConfig } from '../../selectors';
import { ClientAction, DocumentAction } from '../../action';

import Signal from '../../api/signal';
import * as rtcApi from '../../api/rtc';
import { randomString } from '../../util';

import {
  ClientId, DocumentUpdateEvent,
  AnswerSignalEvent, ClientSignalEvent,
  OfferSignalEvent, isOfferSignalEvent
} from './types';

export default function* clientSaga(): Iterator<Effect> {
  yield all([
    takeEvery(ClientAction.InitServerConnection, initiateConnection)
  ]);
}

function* initiateConnection(action: ClientAction.InitServerConnection): Iterator<Effect> {
  const { slug } = action.payload;
  const clientId = yield call(randomString);
  const config: Config = yield select(getConfig);
  const signal = yield call(() => new Signal(config.signalUrl));

  const channel = yield call(createRtcOfferChannel, signal, slug, clientId);

  yield call([signal, signal.broadcast], slug, {
    type: ClientSignalEvent,
    clientId: clientId
  });

  yield takeEvery(channel, connectToServer, signal, slug, clientId);
}

function* connectToServer(
  signal: Signal, slug: Slug, clientId: ClientId, event: OfferSignalEvent
): Iterator<Effect | Array<Effect>> {
  const config = yield select(getConfig);
  const rtcConn = yield call(rtcApi.createRTCConnection, config.stunServers);

  const [answer, candidates] = yield call(rtcApi.makeAnswer, rtcConn, event.offer);

  const results = yield join(
    yield fork([signal, signal.broadcast], slug, {
      type: AnswerSignalEvent,
      answer,
      candidates,
      clientId: clientId
    }),
    yield fork(rtcApi.awaitDataChannel, rtcConn)
  );

  const dataChannel: RTCDataChannel = results[1];
  const channel = yield call(createMessageChannel, dataChannel);

  yield takeEvery(channel, updateDocument);
}

function* updateDocument(event: DocumentUpdateEvent): Iterator<Effect> {
  yield put(DocumentAction.updateDocument(event.document.slug, event.document));
}

function createRtcOfferChannel(signal: Signal, slug: Slug, clientId: string): Channel<OfferSignalEvent> {
  return eventChannel(emitter => signal.listenForMessages(slug, evt => {
    if (isOfferSignalEvent(evt) && evt.clientId === clientId) {
      emitter(evt);
      emitter(END);
    }
  }));
}

function createMessageChannel(dataChannel: RTCDataChannel): Channel<DocumentUpdateEvent> {
  return eventChannel(emitter => {
    const handler = (evt: MessageEvent) => emitter(JSON.parse(evt.data));
    dataChannel.addEventListener('message', handler);

    return () => dataChannel.removeEventListener('message', handler);
  });
}
