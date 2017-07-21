import { Reducer } from 'redux';

import { AppState, initialState } from '../state';
import { Action, SlugAction } from '../action';

const slugReducer: Reducer<AppState['slug']> =
(state = initialState.slug, action: Action) => {
  switch (action.type) {

    case SlugAction.SET_SLUG:
      return action.payload.slug;

    default:
      return state;
  }
};

export default slugReducer;
