import { Reducer } from 'redux';

import { AppState, initialState } from '../state';
import { Action, DocumentAction } from '../action';

const documentsReducer: Reducer<AppState['documents']> =
(state = initialState.documents, action: Action) => {
  switch (action.type) {

    case DocumentAction.SetAllDocuments:
      return action.payload.documents

    default:
      return state;
  }
};

export default documentsReducer;
