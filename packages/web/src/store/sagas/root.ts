import { Effect, call, all } from 'redux-saga/effects';

import rtcSaga from './rtc';
import documentSaga from './document';

export default function* rootSaga(): Iterator<Effect> {
  yield all([
    call(rtcSaga),
    call(documentSaga),
  ]);
}
