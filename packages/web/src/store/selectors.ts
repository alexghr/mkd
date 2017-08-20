import { Selector } from 'reselect';
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
