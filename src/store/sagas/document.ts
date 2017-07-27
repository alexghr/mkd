import { Effect, takeEvery, call, put, all } from 'redux-saga/effects';

import * as documentApi from '../api/doc-storage';
import { randomString } from '../util';
import { DocumentAction, ServerAction } from '../action';

function* newDocument(action: DocumentAction.NewDocument): Iterator<Effect> {
  const text = action.payload.text;
  const slug = yield call(randomString);

  yield put(DocumentAction.updateDocument(slug, text));
  yield call(documentApi.storeDocument, { slug, text });
}

function* saveDocument(action: DocumentAction.UpdateDocument): Iterator<Effect> {
  yield call(documentApi.storeDocument, action.payload);
}

function* loadDocument(action: DocumentAction.LoadDocument): Iterator<Effect> {
  const { slug } = action.payload;

  if (documentApi.ownsDocument(slug)) {
    const doc = documentApi.restoreDocument(slug);
    yield put(DocumentAction.updateDocument(doc.slug, doc.text));

    if (doc.shared) {
      yield put(DocumentAction.shareDocument(slug));
    }
  } else {
    yield put(DocumentAction.updateDocument(slug, ''));
  }
}

function* shareDocument(action: DocumentAction.ShareDocument): Iterator<Effect> {
  const { slug } = action.payload;
  yield call(documentApi.storeDocument, { slug, shared: true });
  yield put(ServerAction.listenForClients(slug));
}

export default function* slugSaga(): Iterator<Effect> {
  yield all([
    takeEvery(DocumentAction.NewDocument, newDocument),
    takeEvery(DocumentAction.UpdateDocument, saveDocument),
    takeEvery(DocumentAction.LoadDocument, loadDocument),
    takeEvery(DocumentAction.ShareDocument, shareDocument)
  ]);
}
