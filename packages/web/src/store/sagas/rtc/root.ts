import { Effect, call, all } from 'redux-saga/effects';

import serverSaga from './server';
import clientSaga from './client';

export default function* rtcRootSaga() {
  yield all([
    call(serverSaga),
    call(clientSaga)
  ]);
}
