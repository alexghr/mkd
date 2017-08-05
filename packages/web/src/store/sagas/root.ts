import { Effect, call, all } from 'redux-saga/effects';

import rtcSaga from './rtc';
import documentSaga from './document';
import configSaga from './config';

export default function* rootSaga(): Iterator<Effect> {
  yield all([
    call(rtcSaga),
    call(documentSaga),
    call(configSaga)
  ]);
}
