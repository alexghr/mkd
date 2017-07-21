import { Effect, takeEvery, call, select } from 'redux-saga/effects';

import * as sessionApi from '../api/session';
import { SessionAction } from '../action';
import { getSlug } from '../selectors';

function* sendOffer(action: SessionAction.SendOffer): Iterator<Effect> {
  const slug = yield select(getSlug);
  yield call(sessionApi.sendOfferDescription, slug, action.payload.sessionDescription);
}

function* sendAnswer(action: SessionAction.SendAnswer): Iterator<Effect> {
  const slug = yield select(getSlug);
  yield call(sessionApi.sendAnswerDescription, slug, action.payload.sessionDescription);
}

function* sendCandidate(action: SessionAction.SendIceCandidate): Iterator<Effect> {
  const slug = yield select(getSlug);
  yield call(sessionApi.sendIceCandidate, slug, action.payload.source, action.payload.iceCandidate);
}

export default function* sessionSaga(): Iterator<Array<Effect>> {
  yield [
    takeEvery(SessionAction.SEND_OFFER, sendOffer),
    takeEvery(SessionAction.SEND_ANSWER, sendAnswer),
    takeEvery(SessionAction.SEND_ICE_CANDIDATE, sendCandidate),
  ];
}
