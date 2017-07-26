import { Effect, takeEvery, call, put } from 'redux-saga/effects';

import * as slugApi from '../api/slug';
import * as documentApi from '../api/doc-storage';
import { DocumentAction } from '../action';

// function* restoreSlug(): Iterator<Effect> {
//   const slug = yield call(slugApi.readSlugFromUrl);
//   console.log('got slug from url', slug);
//   yield put.resolve(DocumentAction.initDocument(slug, ''));
// }

function* newDocument(action: DocumentAction.NewDocument): Iterator<Effect> {
  const text = action.payload.text;
  const slug = yield call(slugApi.generateSlug);

  yield put(DocumentAction.updateDocument(slug, text));
  yield call(documentApi.storeDocument, { slug, text })
}

function* saveDocument(action: DocumentAction.UpdateDocument): Iterator<Effect> {
  yield call(documentApi.storeDocument, action.payload);
}

function* loadDocument(action: DocumentAction.LoadDocument): Iterator<Effect> {
  const { slug } = action.payload;

  if (documentApi.ownsDocument(slug)) {
    const doc = documentApi.restoreDocument(slug);
    yield put(DocumentAction.updateDocument(doc.slug, doc.text));
  } else {
    console.log('broadcast a request');
  }
}

export default function* slugSaga(): Iterator<Array<Effect>> {
  yield [
    takeEvery(DocumentAction.NewDocument, newDocument),
    takeEvery(DocumentAction.UpdateDocument, saveDocument),
    takeEvery(DocumentAction.LoadDocument, loadDocument),
  ];
}
