import { Effect, takeEvery, call, put } from 'redux-saga/effects';

import * as slugApi from '../api/slug';
import { DocumentAction } from '../action';

// function* restoreSlug(): Iterator<Effect> {
//   const slug = yield call(slugApi.readSlugFromUrl);
//   console.log('got slug from url', slug);
//   yield put.resolve(DocumentAction.initDocument(slug, ''));
// }

function* newDocument(action: DocumentAction.NewDocument): Iterator<Effect> {
  // yield put.resolve(DocumentAction.createSlug());
  const slug = yield call(slugApi.generateSlug);
  yield put(DocumentAction.updateDocument(slug, action.payload.text));
}

export default function* slugSaga(): Iterator<Array<Effect>> {
  yield [
    takeEvery(DocumentAction.NewDocument, newDocument)
  ]
}
