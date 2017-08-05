import * as signalhub from 'signalhub';
import { Slug } from '../state';

export function listenForMessages(slug: Slug, cb: (evt: object) => void) {
  const stream = getHubConnection().subscribe(slug);
  const eventHandler = (data: object) => {
    cb(data);
  };

  stream.addListener('data', eventHandler);

  return () => stream.removeListener('data', eventHandler);
}

export function broadcast(slug: Slug, message: object) {
  const hub = getHubConnection();
  hub.broadcast(slug, message);
}

let hubConn: signalhub.SignalHub;
function getHubConnection() {
  if (hubConn) {
    return hubConn;
  }

  return hubConn = signalhub('mkd', ['localhost:8080']);
}
