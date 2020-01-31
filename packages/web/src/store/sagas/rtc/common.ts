import { Effect, call, take } from 'redux-saga/effects';
import { Channel, eventChannel } from 'redux-saga';

import Signal from '../../api/signal';
import { Slug } from '../../state';
import { ClientId, SignalEventSource, CandidateSignalEvent, isCandidateSignalEvent } from './types';

export function* shareIceCandidates(
  rtcConn: RTCPeerConnection, clientId: ClientId, signal: Signal, slug: Slug, source: SignalEventSource
) {
  const channel: Channel<RTCIceCandidate> = yield call(createRtcIceCandidateChannel, rtcConn);

  while (true) {
    const candidate: RTCIceCandidate = yield take(channel);
    yield call([signal, signal.broadcast], slug, {
      type: CandidateSignalEvent,
      clientId,
      candidate,
      source
    } as CandidateSignalEvent);
  }
}

export function* handleIceCandidates(
  rtcConn: RTCPeerConnection, clientId: ClientId, signal: Signal, slug: Slug, source: SignalEventSource
) {
  const channel: Channel<RTCIceCandidate> = yield call(
    createCandidateSignalEventChannel, signal, slug, clientId, source
  );

  while (true) {
    const candidate: RTCIceCandidate = yield take(channel);
    rtcConn.addIceCandidate(candidate);
  }
}

function createRtcIceCandidateChannel(rtcConn: RTCPeerConnection) {
  return eventChannel<RTCIceCandidate>(emitter => {
    const fun = (evt: RTCPeerConnectionIceEvent) => {
      if (evt.candidate) {
        emitter(evt.candidate);
      }
    };

    rtcConn.addEventListener('icecandidate', fun);

    return () => rtcConn.removeEventListener('icecandidate', fun);
  });
}

function createCandidateSignalEventChannel(
  signal: Signal, slug: Slug, clientId: ClientId, source: SignalEventSource
) {
  return eventChannel<RTCIceCandidate>(emitter => signal.listenForMessages(slug, (evt: object) => {
    if (isCandidateSignalEvent(evt) && evt.clientId === clientId && evt.source === source) {
      const candidate = new RTCIceCandidate(evt.candidate);
      emitter(candidate);
    }
  }));
}
