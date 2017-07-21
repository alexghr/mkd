import { Reducer } from 'redux';

import { AppState, initialState } from '../state';
import { Action, ShareAction } from '../action';

const shareReducer: Reducer<AppState['isMaster']> =
(state = initialState.isMaster, action: Action) => {
  switch (action.type) {

    case ShareAction.SET_IS_MASTER:
      return action.payload.isMaster;

    default:
      return state;
  }
};

export default shareReducer;
