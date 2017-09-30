import { Reducer } from 'redux';

import { AppState, initialState } from '../state';
import { Action, ClientAction } from '../action';

const documentReducer: Reducer<AppState['connectionStatus']> =
(state = initialState.connectionStatus, action: Action) => {
  switch (action.type) {
    case ClientAction.SetConnectionStatus:
      return action.payload.status;

    default:
      return state;
  }
};

export default documentReducer;
