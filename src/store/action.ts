import { ActionCreator } from 'redux';
import { Slug } from './state';

export type Action = DocumentActions | SessionActions;
export default Action;

export namespace DocumentAction {
  export const NewDocument = 'document.new'
  export const UpdateDocument = 'document.update';
  export const LoadDocument = 'document.restore';

  export type NewDocument = {
    type: typeof NewDocument,
    payload: {
      text?: string
    }
  };

  export type UpdateDocument = {
    type: typeof UpdateDocument,
    payload: {
      slug: Slug,
      text: string
    }
  };

  export type LoadDocument = {
    type: typeof LoadDocument,
    payload: {
      slug: Slug
    }
  }

  export const newDocument: ActionCreator<NewDocument> = (text: string) => ({
    type: NewDocument,
    payload: { text }
  });

  export const updateDocument: ActionCreator<UpdateDocument> = (slug: string, text: string) => ({
    type: UpdateDocument,
    payload: { slug, text }
  });

  export const loadDocument: ActionCreator<LoadDocument> = (slug: Slug) => ({
    type: LoadDocument,
    payload: { slug }
  });
}

type DocumentActions = DocumentAction.NewDocument | DocumentAction.UpdateDocument | DocumentAction.LoadDocument;

export namespace SessionAction {
  export const SEND_OFFER = 'ses.send_offer';
  export const SEND_ANSWER = 'ses.send_answer';

  export type SendOffer = {
    type: typeof SEND_OFFER
    payload: {
      sessionDescription: RTCSessionDescription
    }
  }

  export type SendAnswer = {
    type: typeof SEND_ANSWER
    payload: {
      sessionDescription: RTCSessionDescription
    }
  }

  export const sendOffer: ActionCreator<SendOffer> =
    (sessionDescription: RTCSessionDescription) => ({
      type: SEND_OFFER,
      payload: { sessionDescription }
    });

  export const sendAnswer: ActionCreator<SendAnswer> =
    (sessionDescription: RTCSessionDescription) => ({
      type: SEND_ANSWER,
      payload: { sessionDescription }
    });
}

type SessionActions = SessionAction.SendOffer | SessionAction.SendAnswer;
