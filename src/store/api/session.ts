import * as hub from 'signalhub';
import { Slug } from '../state';

export function listenForMessages(slug: Slug, cb: Function) {
  const stream = getHubConnection().subscribe(slug);
  const eventHandler = (evt: MessageEvent) => {
    cb(evt.data);
  };

  stream.on('data', eventHandler);

  return () => stream.off('data', eventHandler);
}

let hubConn: hub.SignalHub;
function getHubConnection() {
  if (hubConn) {
    return hubConn;
  }

  return hubConn = hub('mkd', ['localhost:8080']);
}
