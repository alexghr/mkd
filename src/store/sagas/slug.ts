import { Effect, takeEvery, call, put } from 'redux-saga/effects';

import * as slugApi from '../api/slug';
import { SlugAction } from '../action';

function* createSlug(): Iterator<Effect> {
  const slug = yield call(slugApi.generateSlug);
  yield call(slugApi.putSlugInUrl, slug);
  yield put(SlugAction.setSlug(slug));
}

function* restoreSlug(): Iterator<Effect> {
  const slug = yield call(slugApi.readSlugFromUrl);
  console.log('got slug from url', slug);
  yield put.resolve(SlugAction.setSlug(slug));
}

export default function* slugSaga(): Iterator<Array<Effect>> {
  yield [
    takeEvery(SlugAction.CREATE_SLUG, createSlug),
    takeEvery(SlugAction.RESTORE_SLUG, restoreSlug)
  ]
}
