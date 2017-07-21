import { Slug } from '../state';

export function createPublishStream(slug: Slug) {
  const peerConn = new RTCPeerConnection({});
  const dataChannel = peerConn.createDataChannel(slug, {});
  dataChannel.onopen = () => {};
}
