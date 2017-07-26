import { ActionCreator } from 'redux';
import { Slug } from './state';

export type Action = DocumentActions | SessionActions;
export default Action;

export namespace DocumentAction {
  export const NewDocument = 'document.new'
  export const UpdateDocument = 'document.update';

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

  export const newDocument: ActionCreator<NewDocument> = (text: string) => ({
    type: NewDocument,
    payload: { text }
  });

  export const updateDocument: ActionCreator<UpdateDocument> = (slug: string, text: string) => ({
    type: UpdateDocument,
    payload: { slug, text }
  });
}

type DocumentActions = DocumentAction.NewDocument | DocumentAction.UpdateDocument;

export namespace SessionAction {
  export const SEND_OFFER = 'ses.send_offer';
  export const SEND_ANSWER = 'ses.send_answer';
  export const SEND_ICE_CANDIDATE = 'ses.send_ice_candidate';

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

  export type SendIceCandidate = {
    type: typeof SEND_ICE_CANDIDATE
    payload: {
      source: 'client' | 'master',
      iceCandidate: RTCIceCandidate | Array<RTCIceCandidate>
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


  export const sendIceCandidate: ActionCreator<SendIceCandidate> =
    (source: 'client' | 'master', iceCandidate: RTCIceCandidate | Array<RTCIceCandidate>) => ({
      type: SEND_ICE_CANDIDATE,
      payload: {
        source,
        iceCandidate
      }
    });
}

type SessionActions = SessionAction.SendOffer | SessionAction.SendAnswer | SessionAction.SendIceCandidate;
