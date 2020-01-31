declare module 'signalhub' {

  function signalhub(name: string, hubs: Array<string>): signalhub.SignalHub;

  namespace signalhub {
    interface SignalHub {
      subscribe(channel: string): EventListener;
      broadcast(channel: string, data: any, cb?: Function): void;
      close(cb?: Function): void;
    }

    interface EventListener {
      addListener: (evt: string, callback: EventHandler) => void;
      removeListener: (evt: string, callback: EventHandler) => void;
    }

    type EventHandler = (event: object) => any;
  }

  export = signalhub;
}
