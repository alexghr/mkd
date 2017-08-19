import * as signalhub from 'signalhub';
import { Slug } from '../state';

export default class Signal {

  private _hubConn: signalhub.SignalHub | null = null;
  private _subMap: Map<string, signalhub.EventListener> = new Map();

  constructor(private signalUrl: string) {}

  listenForMessages(slug: Slug, cb: (evt: object) => void) {
    if (!this._subMap.has(slug)) {
      this._subMap.set(slug, this.connection.subscribe(slug));
    }

    const stream = this._subMap.get(slug)!;

    const eventHandler = (data: object) => {
      cb(data);
    };

    stream.addListener('data', eventHandler);

    return () => stream.removeListener('data', eventHandler);
  }

  broadcast(slug: Slug, message: object) {
    this.connection.broadcast(slug, message);
  }

  private get connection(): signalhub.SignalHub {
    if (!this._hubConn) {
      this._hubConn = signalhub('mkd', [this.signalUrl]);
    }

    return this._hubConn;
  }
}
