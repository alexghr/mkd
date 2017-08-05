export function createRTCConnection() {
  return new RTCPeerConnection({});
}

export function gatherIceCandidates(rtcConn: RTCPeerConnection): Promise<Array<RTCIceCandidate>> {
  if (rtcConn.iceGatheringState === 'complete') {
    return Promise.resolve([]);
  }

  return new Promise((res, rej) => {
    const candidates: Array<RTCIceCandidate> = [];

    rtcConn.onicecandidate = (evt) => {
      if (evt.candidate) {
        candidates.push(evt.candidate);
      } else {
        res(candidates);
      }
    };
  });
}

export function makeOffer(rtcConn: RTCPeerConnection): Promise<SessionCandidatesTuple> {
  return rtcConn.createOffer()
    .then(offer => rtcConn.setLocalDescription(offer))
    .then(() => gatherIceCandidates(rtcConn))
    .then<SessionCandidatesTuple>((candidates) => [rtcConn.localDescription!, candidates]);
}

export function makeAnswer(rtcConn: RTCPeerConnection, offer: RTCSessionDescription): Promise<SessionCandidatesTuple> {
  return rtcConn.setRemoteDescription(offer)
    .then(() => rtcConn.createAnswer())
    .then(answer => rtcConn.setLocalDescription(answer))
    .then(() => gatherIceCandidates(rtcConn))
    .then<SessionCandidatesTuple>(candidates => [rtcConn.localDescription!, candidates]);
}

export function awaitDataChannel(rtcConn: RTCPeerConnection): Promise<RTCDataChannel> {
  return new Promise<RTCDataChannel>((res, rej) => {
    rtcConn.ondatachannel = (evt) => res(evt.channel);
  });
}

export function awaitDataChannelOpen(dataChannel: RTCDataChannel): Promise<RTCDataChannel> {
  return new Promise((res, rej) => {
    if (dataChannel.readyState === 'open') {
      res(dataChannel);
    } else {
      dataChannel.onopen = () => res(dataChannel);
    }
  });
}

type SessionCandidatesTuple = [RTCSessionDescription, Array<RTCIceCandidate>];
