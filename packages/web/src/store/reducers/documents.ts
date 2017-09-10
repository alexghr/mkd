import { Reducer } from 'redux';

import { AppState, initialState, MkdDocument, Slug } from '../state';
import { Action, DocumentAction } from '../action';

const documentsReducer: Reducer<AppState['documents']> =
(state = initialState.documents, action: Action) => {
  switch (action.type) {

    case DocumentAction.SetAllDocuments:
      return action.payload.documents;

    case DocumentAction.UpdateDocument:
      const oldDoc = state ? state[action.payload.slug] : {};

      const mkd: Record<Slug, MkdDocument> =  {
        ...state,
        [action.payload.slug]: {
          ...oldDoc as MkdDocument,
          ...action.payload.document
        }
      };

      return mkd;

    default:
      return state;
  }
};

export default documentsReducer;
