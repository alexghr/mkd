import { combineReducers, Reducer } from 'redux';

import AppState from '../state';

import documentReducer from './document';
import documentsReducer from './documents';
import configReducer from './config';
import connectionStatusReducer from './connectionStatus';

type Reducers = {
  [K in keyof AppState]: Reducer<AppState[K]>
};

const reducers: Reducers = {
  documents: documentsReducer,
  document: documentReducer,
  config: configReducer,
  connectionStatus: connectionStatusReducer
};

const rootReducer: Reducer<AppState> = combineReducers(reducers);

export default rootReducer;
