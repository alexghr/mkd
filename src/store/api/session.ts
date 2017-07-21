import * as hub from 'signalhub';
import { Slug } from '../state';

export type SessionEvent = {
  source: 'master' | 'client',
  offer?: RTCSessionDescription,
  answer?: RTCSessionDescription,
  candidates?: Array<RTCIceCandidate>
};

export function sendOfferDescription(slug: Slug, session: RTCSessionDescription): void {
  getHubConnection().broadcast(slug, {
    source: 'master',
    offer: session
  });
}

export function sendAnswerDescription(slug: Slug, session: RTCSessionDescription): void {
  getHubConnection().broadcast(slug, {
    source: 'client',
    answer: session
  });
}

export function onClientMessage(slug: Slug, cb: (evt: SessionEvent) => any) {
  return onMessage(slug, 'client', cb);
}

export function onMasterMessage(slug: Slug, cb: (evt: SessionEvent) => any) {
  return onMessage(slug, 'master', cb);
}

export function sendIceCandidate(slug: Slug, source: string, candidates: Array<RTCIceCandidate>): void {
  getHubConnection().broadcast(slug, {
    source,
    candidates
  });
}

let hubConn: hub.SignalHub;
function getHubConnection() {
  if (hubConn) {
    return hubConn;
  }

  return hubConn = hub('mkd', ['localhost:8080']);
}

function onMessage(slug: Slug, source: string, cb: (evt: SessionEvent) => any) {
  const stream = getHubConnection().subscribe(slug);
  const eventHandler = (evt: any) => {
    if (evt.source === source) {
      cb(evt);
    }
  };

  stream.on('data', eventHandler);

  return () => stream.off('data', eventHandler);
}
