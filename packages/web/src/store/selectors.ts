import { Selector, createSelector } from 'reselect';
import { AppState, Slug } from './state';

export const getSlug: Selector<AppState, Slug | null> =
  (state) => state.document ? state.document.slug : null;

export const getText: Selector<AppState, string> =
  (state) => state.document ? state.document.text : '';

export const getDocument: Selector<AppState, AppState['document']> =
  (state) => state.document;

export const getDocuments: Selector<AppState, AppState['documents']> =
  (state) => state.documents;

export const getConfig: Selector<AppState, AppState['config']> =
  (state) => state.config;

export const getOrderedDocuments = createSelector(
  getDocuments,
  (documents) => Object.keys(documents)
    .map(slug => documents[slug])
    .sort((doc1, doc2) => doc2.updatedAt.getTime() - doc1.updatedAt.getTime())
);
