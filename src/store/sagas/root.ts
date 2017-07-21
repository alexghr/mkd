import { Effect, call } from 'redux-saga/effects';

import sessionSaga from './session';
import shareSaga from './share';
import slugSaga from './slug';

export default function* rootSaga(): Iterator<Array<Effect>> {
  yield [
    call(sessionSaga),
    call(slugSaga),
    call(shareSaga)
  ];
}
