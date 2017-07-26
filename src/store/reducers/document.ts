import { Reducer } from 'redux';

import { AppState, initialState } from '../state';
import { Action, DocumentAction } from '../action';

const documentReducer: Reducer<AppState['document']> =
(state = initialState.document, action: Action) => {
  switch (action.type) {

    case DocumentAction.UpdateDocument:
      return {
        slug: action.payload.slug,
        text: action.payload.text
      };

    default:
      return state;
  }
};

export default documentReducer;
