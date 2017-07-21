import { Effect, takeEvery, put, select } from 'redux-saga/effects';
import { SlugAction, ShareAction } from '../action';

import { getSlug } from '../selectors';

function* share(): Iterator<Effect> {
  yield put(SlugAction.createSlug());
}

function* watch(): Iterator<Effect> {
  const hasSlug = yield put.resolve(SlugAction.restoreSlug());
  const slug = yield select(getSlug);

  console.log('hasSlug', hasSlug, slug);

  if (slug) {
    yield put(ShareAction.setIsMaster(false));
  } {
    yield put(ShareAction.setIsMaster(true));
  }
}

export default function* shareSaga(): Iterator<Array<Effect>> {
  yield [
    takeEvery(ShareAction.SHARE, share),
    takeEvery(ShareAction.WATCH, watch)
  ];
}

// import { eventChannel, Channel } from 'redux-saga';
//
// import { SessionAction, SlugAction } from '../action';
// import { getSlug } from '../selectors';
//
// import { SessionEvent, onClientMessage } from '../api/session';
//
// function getIceCandidates(peerConn: RTCPeerConnection): Promise<Array<RTCIceCandidate>> {
//   return new Promise((res, rej) => {
//     const candidates: Array<RTCIceCandidate> = [];
//
//     peerConn.onicecandidate = (evt) => {
//       if (evt.candidate) {
//         candidates.push(evt.candidate);
//       } else {
//         res(candidates);
//       }
//     };
//   });
// }
//
// function* share(): Iterator<Effect> {
//   yield put(SlugAction.createSlug());
//   const slug = yield select(getSlug);
//
//   const peerConn = new RTCPeerConnection({});
//   const dataChannel = peerConn.createDataChannel(slug, {});
//   dataChannel.onopen = () => {};
//
//   yield call(sendIceCandidates, peerConn, 'master');
//
//   const offer = yield call(peerConn.createOffer.bind(peerConn));
//   peerConn.setLocalDescription(offer);
//
//   yield put(SessionAction.sendOffer(offer));
//
//   const channel = yield call(watchClientMessages, slug);
//   while (true) {
//     const evt: SessionEvent = yield take(channel);
//     if (evt.answer) {
//       peerConn.setRemoteDescription(evt.answer);
//     } else if (evt.candidates) {
//       evt.candidates.forEach(c => peerConn.addIceCandidate(c));
//     }
//   }
// }
//
// function* watch(): Iterator<Effect> {
//   yield put(SlugAction.restoreSlug());
//   const slug = yield select(getSlug);
// }
//
// export default function* shareSaga(): Iterator<Array<Effect>> {
//   yield [
//     takeEvery('share', share)
//   ];
// }
//
// function watchClientMessages(slug: string): Channel<SessionEvent> {
//   return eventChannel(emitter => {
//     return onClientMessage(slug, (evt: SessionEvent) => {
//       emitter(evt);
//     });
//   });
// }
//
// function* sendIceCandidates(peerConn: RTCPeerConnection, source: 'client' | 'master') {
//   const candidates = yield call(getIceCandidates, peerConn);
//   yield put(SessionAction.sendIceCandidate(source, candidates));
// }
