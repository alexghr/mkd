import { Reducer } from 'redux';

import { AppState, initialState } from '../state';
import { Action, DocumentAction } from '../action';

const documentReducer: Reducer<AppState['document']> =
(state = initialState.document, action: Action) => {
  switch (action.type) {

    case DocumentAction.ShareDocument:
      return {
        slug: action.payload.slug,
        text: '',
        ...state,
        shared: true
      };

    case DocumentAction.UpdateDocument:
      return {
        shared: false,
        ...state,
        slug: action.payload.slug,
        text: action.payload.text,
      };

    default:
      return state;
  }
};

export default documentReducer;
