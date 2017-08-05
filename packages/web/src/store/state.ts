export type AppState = {
  document: Document | null
};

export type Slug = string;

export type Document = {
  slug: Slug,
  text: string,
  shared?: boolean
};

export type Peer = {
  rtcPeerConnection: RTCPeerConnection,
  rtcDataChannel: RTCDataChannel
};

export const initialState: AppState = {
  document: null
};

export default AppState;
