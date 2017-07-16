declare module 'signalhub' {
  type SignalHub = {
    subscribe: (channel: string) => {on: Function};
    broadcast: (channel: string, data: any, cb?: Function) => void;
    close: (cb?: Function) => void;
  };

  type SignalHubCtor = (name: string, hubs: Array<string>) => SignalHub;

  const fn: SignalHubCtor;
  export = fn;
}

declare interface RTCPeerConnection {
  ondatachannel: (this: RTCPeerConnection, chann: RTCDataChannelEvent) => any;
  createDataChannel(name: string | null, options?: RTCDataChannelInit): RTCDataChannel;
}

declare interface RTCDataChannelEvent extends Event {
  channel: RTCDataChannel
}

declare interface RTCDataChannelInit {
  ordered?: boolean;
  maxPacketLifeTime?: number;
  maxRetransmits?: number;
  protocol?: string;
  negotiated?: boolean;
  id?: number;
}

declare class RTCDataChannel extends EventTarget {
  readonly label: string;
  readonly id: number;
  readonly ordered: boolean;
  readonly maxPacketLifeTime: number;
  readonly maxRetransmits: number;
  readonly protocol: string;
  readonly negotiated: boolean;

  readonly readyState: 'connecting' | 'open';

  onopen: (this: RTCDataChannel) => any;
  onerror: (this: RTCDataChannel, evt: ErrorEvent) => any;
  onmessage: (this: RTCDataChannel, evt: MessageEvent) => any;
  onclose: (this: RTCDataChannel) => any;

  send(arg: USVString | Blob | ArrayBuffer | ArrayBufferView): void;
  close(): void;
}
