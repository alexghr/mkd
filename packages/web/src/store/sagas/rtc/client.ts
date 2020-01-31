import { Effect, takeEvery, cancel, take, put, call, join, fork, all, select, race, delay } from 'redux-saga/effects';
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

import { shareIceCandidates, handleIceCandidates } from './common';

export default function* clientSaga() {
  yield all([
    takeEvery(ClientAction.InitServerConnection, initiateConnection)
  ]);
}

function* initiateConnection(action: ClientAction.InitServerConnection) {
  yield put(ClientAction.setConnectionStatus('connecting'));

  const { slug } = action.payload;
  const clientId = yield call(randomString);

  const config: Config = yield select(getConfig);
  const signal = yield call(() => new Signal(config.signalUrl));

  const channel = yield call(createRtcOfferChannel, signal, slug, clientId);

  yield call([signal, signal.broadcast], slug, {
    type: ClientSignalEvent,
    clientId: clientId
  });

  const { offer, timeout } = yield race({
    offer: take(channel),
    timeout: delay(5000, true)
  });

  if (timeout || !offer) {
    yield put(ClientAction.setConnectionStatus('error'));
  } else {
    yield call(connectToServer, signal, slug, clientId, offer);
  }

  yield takeEvery(ClientAction.Close, () => signal.close());
}

function* connectToServer(
  signal: Signal, slug: Slug, clientId: ClientId, event: OfferSignalEvent
) {
  const config = yield select(getConfig);
  const rtcConn: RTCPeerConnection = yield call(rtcApi.createRTCConnection, config.stunServers);

  yield takeEvery(ClientAction.Close, () => {
    if (rtcConn.iceConnectionState === 'connected') {
      rtcConn.close();
    }
  });

  const answer = yield call(rtcApi.makeAnswer, rtcConn, event.offer);

  yield fork(handleIceCandidates, rtcConn, clientId, signal, slug, 'server');
  yield fork(shareIceCandidates, rtcConn, clientId, signal, slug, 'client');

  const results = yield join(
    yield fork([signal, signal.broadcast], slug, {
      type: AnswerSignalEvent,
      answer,
      clientId
    }),
    yield fork(awaitDataChannelOrDie, rtcConn)
  );

  const dataChannel: RTCDataChannel = results[1];

  if (dataChannel) {
    yield put(ClientAction.setConnectionStatus('open'));
    yield takeEvery(ClientAction.Close, () => {
      if (dataChannel.readyState === 'open') {
        dataChannel.close();
      }
    });

    const channel = yield call(createMessageChannel, dataChannel);

    yield takeEvery(channel, updateDocument);
  } else {
    yield put(ClientAction.setConnectionStatus('error'));
  }
}

function* updateDocument(event: DocumentUpdateEvent) {
  yield put(DocumentAction.updateDocument(event.document.slug, event.document));
}

function createRtcOfferChannel(signal: Signal, slug: Slug, clientId: string) {
  return eventChannel(emitter => signal.listenForMessages(slug, evt => {
    if (isOfferSignalEvent(evt) && evt.clientId === clientId) {
      emitter(evt);
      emitter(END);
    }
  }));
}

function createMessageChannel(dataChannel: RTCDataChannel) {
  return eventChannel(emitter => {
    const handler = (evt: MessageEvent) => emitter(JSON.parse(evt.data));
    dataChannel.addEventListener('message', handler);

    return () => dataChannel.removeEventListener('message', handler);
  });
}

function* awaitDataChannelOrDie(rtcConn: RTCPeerConnection) {
  const task = yield fork(rtcApi.awaitDataChannel, rtcConn);

  try {
    yield call(waitForConnectionEstablised, rtcConn);
    const val = yield join(task);
    return val;
  } catch (e) {
    yield cancel(task);
    return null;
  }
}

function waitForConnectionEstablised(rtcConn: RTCPeerConnection): Promise<void> {

  if (rtcConn.iceConnectionState === 'failed') {
    return Promise.reject(undefined);
  } else if (rtcConn.iceConnectionState === 'connected') {
    return Promise.resolve();
  } else {
    return new Promise((res, rej) => {
      const fn = () => {
        if (rtcConn.iceConnectionState === 'failed') {
          rtcConn.removeEventListener('iceconnectionstatechange', fn);
          rej();
        } else if (rtcConn.iceConnectionState === 'connected') {
          rtcConn.removeEventListener('iceconnectionstatechange', fn);
          res();
        }
      };

      rtcConn.addEventListener('iceconnectionstatechange', fn);
    });
  }
}
