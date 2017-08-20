import { combineReducers, Reducer } from 'redux';

import AppState from '../state';

import documentReducer from './document';
import documentsReducer from './documents';
import configReducer from './config';

type Reducers = {
  [K in keyof AppState]: Reducer<AppState[K]>
};

const reducers: Reducers = {
  documents: documentsReducer,
  document: documentReducer,
  config: configReducer
};

const rootReducer: Reducer<AppState> = combineReducers(reducers);

export default rootReducer;
