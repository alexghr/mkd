import { Reducer } from 'redux';

import { AppState, initialState, MkdDocument } from '../state';
import { Action, DocumentAction } from '../action';

const documentReducer: Reducer<AppState['document']> =
(state = initialState.document, action: Action) => {
  switch (action.type) {

    case DocumentAction.ShareDocument:
      return {
        ...state,
        shared: true
      } as MkdDocument;

    case DocumentAction.SetDocument:
      return action.payload.document;

    default:
      return state;
  }
};

export default documentReducer;
