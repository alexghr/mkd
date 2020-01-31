import { Effect, all, put, putResolve, takeEvery } from 'redux-saga/effects';

import { AppAction, ConfigAction, DocumentAction, ServerAction, ClientAction } from '../action';

export default function* appSaga(): Iterator<Effect> {
  yield all([
    takeEvery(AppAction.Init, init),
    takeEvery(AppAction.Close, close)
  ]);
}

function* init(): Iterator<Effect> {
  yield putResolve(ConfigAction.loadConfig());
  yield put(DocumentAction.loadAllDocuments());
}

function* close(): Iterator<Effect> {
  yield put(ServerAction.close());
  yield put(ClientAction.close());
}
