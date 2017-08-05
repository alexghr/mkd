import { Document } from '../../state';

export const DocumentUpdateEvent = 'document.update';
export type DocumentUpdateEvent = {
  type: typeof DocumentUpdateEvent,
  document: Document
};

export type ClientId = string;

export type SignalEvent = OfferSignalEvent | AnswerSignalEvent | ClientSignalEvent;

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
