import { Effect, takeEvery, call, put, all, select } from 'redux-saga/effects';

import * as documentApi from '../api/doc-storage';
import { randomString } from '../util';
import { DocumentAction, ServerAction } from '../action';
import { MkdDocument } from '../state';
import { getDocument } from '../selectors';

export default function* slugSaga(): Iterator<Effect> {
  yield all([
    takeEvery(DocumentAction.NewDocument, newDocument),
    takeEvery(DocumentAction.UpdateDocument, updateDocument),
    takeEvery(DocumentAction.LoadDocument, loadDocument),
    takeEvery(DocumentAction.ShareDocument, shareDocument),
    takeEvery(DocumentAction.LoadAllDocuments, loadAllDocuments)
  ]);
}

function* newDocument(action: DocumentAction.NewDocument): Iterator<Effect> {
  const text = action.payload.text || '';
  const slug = yield call(randomString);
  const now = yield call(() => new Date());

  const doc: MkdDocument = {
    slug,
    text,
    createdAt: now,
    updatedAt: now
  };

  yield call(documentApi.storeDocument, doc);
  yield put(DocumentAction.setDocument(doc));
}

function* updateDocument(action: DocumentAction.UpdateDocument): Iterator<Effect> {
  const doc = yield select(getDocument);
  const now = yield call(() => new Date());
  const newDoc: MkdDocument = {
    ...doc,
    ...action.payload.document,
    updatedAt: now
  };

  yield call(documentApi.storeDocument, newDoc);
  yield put(DocumentAction.setDocument(newDoc));
}

function* loadDocument(action: DocumentAction.LoadDocument): Iterator<Effect> {
  const { slug } = action.payload;

  if (documentApi.ownsDocument(slug)) {
    const doc = documentApi.restoreDocument(slug);
    yield put(DocumentAction.updateDocument(doc.slug, doc));

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

function* loadAllDocuments(action: DocumentAction.LoadAllDocuments): Iterator<Effect> {
  const docs = yield call(documentApi.restoreAllDocuments);
  yield put(DocumentAction.setAllDocuments(docs));
}
