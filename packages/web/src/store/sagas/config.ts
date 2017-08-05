import { Effect, all, takeEvery, call, put } from 'redux-saga/effects';

import { ConfigAction } from '../action';
import { Config } from '../state';

export default function* configSaga(): Iterator<Effect> {
  yield all([
    takeEvery(ConfigAction.LoadConfig, loadConfig)
  ]);
}

function* loadConfig(): Iterator<Effect> {
  const url = process.env.REACT_APP_CONFIG_URL || '/config.json';
  const body: Response = yield call(fetch, url);
  const config: Config = yield call([body, body.json]);

  yield put(ConfigAction.setConfig(config));
}
