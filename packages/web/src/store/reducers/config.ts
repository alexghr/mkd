import { Reducer } from 'redux';

import { AppState, initialState } from '../state';
import { Action, ConfigAction } from '../action';

const configReducer: Reducer<AppState['config']> =
(state = initialState.config, action: Action) => {
  switch (action.type) {

    case ConfigAction.SetConfig:
      return action.payload.config;

    default:
      return state;
  }
};

export default configReducer;
