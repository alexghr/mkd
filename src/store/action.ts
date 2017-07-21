import { ActionCreator } from 'redux';
import { Slug } from './state';

export type Action = ShareActions | SlugActions | SessionActions;
export default Action;

export namespace ShareAction {
  export const SHARE = 'share';
  export const WATCH = 'watch';
  export const SET_IS_MASTER = 'set_master';

  export type Share = {
    type: typeof SHARE
  }

  export type Watch = {
    type: typeof WATCH
  }

  export type SetIsMaster = {
    type: typeof SET_IS_MASTER,
    payload: {
      isMaster: boolean
    }
  }

  export const share: ActionCreator<Share> = () => ({ type: SHARE });
  export const watch: ActionCreator<Watch> = () => ({ type: WATCH });
  export const setIsMaster: ActionCreator<SetIsMaster> = (isMaster: boolean) => ({
    type: SET_IS_MASTER,
    payload: { isMaster }
  });
}

type ShareActions = ShareAction.Share | ShareAction.Watch | ShareAction.SetIsMaster;

export namespace SlugAction {
  export const CREATE_SLUG = 'slug.create';
  export const SET_SLUG = 'slug.set';
  export const RESTORE_SLUG = 'slug.restore';

  export type CreateSlug = {
    type: typeof CREATE_SLUG
  };

  export type RestoreSlug = {
    type: typeof RESTORE_SLUG
  };

  export type SetSlug = {
    type: typeof SET_SLUG,
    payload: {
      slug: Slug | null
    }
  };

  export const createSlug: ActionCreator<CreateSlug> = () => ({
    type: CREATE_SLUG
  });

  export const restoreSlug: ActionCreator<RestoreSlug> = () => ({
    type: RESTORE_SLUG
  });

  export const setSlug: ActionCreator<SetSlug> = (slug: Slug | null) => ({
    type: SET_SLUG,
    payload: { slug }
  });
}

type SlugActions = SlugAction.CreateSlug | SlugAction.RestoreSlug | SlugAction.SetSlug;

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
