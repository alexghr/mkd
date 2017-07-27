import { combineReducers, Reducer } from 'redux';

import AppState from '../state';

import documentReducer from './document';

type Reducers = {
  [K in keyof AppState]: Reducer<AppState[K]>
};

const reducers: Reducers = {
  document: documentReducer
};

const rootReducer: Reducer<AppState> = combineReducers(reducers);

export default rootReducer;
