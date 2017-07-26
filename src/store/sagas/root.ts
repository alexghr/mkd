import { Effect, call } from 'redux-saga/effects';

import sessionSaga from './session';
import documentSaga from './document';

export default function* rootSaga(): Iterator<Array<Effect>> {
  yield [
    call(sessionSaga),
    call(documentSaga),
  ];
}
