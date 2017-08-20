import { MkdDocument } from '../../state';

export const DocumentUpdateEvent = 'document.update';
export type DocumentUpdateEvent = {
  type: typeof DocumentUpdateEvent,
  document: MkdDocument
};

export type ClientId = string;
export type SignalEventSource = 'server' | 'client';

export type SignalEvent = OfferSignalEvent | AnswerSignalEvent | ClientSignalEvent | CandidateSignalEvent;

export const OfferSignalEvent = 'offer';
export type OfferSignalEvent = {
  type: typeof OfferSignalEvent,
  clientId: ClientId,
  offer: object
};

export const AnswerSignalEvent = 'answer';
export type AnswerSignalEvent = {
  type: typeof AnswerSignalEvent,
  clientId: ClientId,
  answer: object
};

export const CandidateSignalEvent = 'candidate';
export type CandidateSignalEvent = {
  type: typeof CandidateSignalEvent,
  clientId: ClientId,
  candidate: object,
  source: SignalEventSource
};

export const ClientSignalEvent = 'client';
export type ClientSignalEvent = {
  type: typeof ClientSignalEvent,
  clientId: ClientId
};

export function isSignalEvent(event: object): event is SignalEvent {
  if (!event || typeof event !== 'object') {
    return false;
  }

  return 'type' in event;
}

export function isClientSignalEvent(event: object): event is ClientSignalEvent {
  return isSignalEvent(event) && event.type === ClientSignalEvent;
}

export function isOfferSignalEvent(event: object): event is OfferSignalEvent {
  return isSignalEvent(event) && event.type === OfferSignalEvent;
}

export function isAnswerSignalEvent(event: object): event is AnswerSignalEvent {
  return isSignalEvent(event) && event.type === AnswerSignalEvent;
}

export function isCandidateSignalEvent(event: object): event is CandidateSignalEvent {
  return isSignalEvent(event) && event.type === CandidateSignalEvent;
}
