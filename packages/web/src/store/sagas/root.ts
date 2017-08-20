import { Effect, call, all } from 'redux-saga/effects';

import appSaga from './app';
import rtcSaga from './rtc';
import documentSaga from './document';
import configSaga from './config';

export default function* rootSaga(): Iterator<Effect> {
  yield all([
    call(appSaga),
    call(rtcSaga),
    call(documentSaga),
    call(configSaga)
  ]);
}
