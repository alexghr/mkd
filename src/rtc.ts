import * as signalhub from 'signalhub';

const hub = signalhub('mkd', ['http://localhost:8080']);

export function publish() {
  const slug = generateUrl();
  const sub = hub.subscribe(slug);

  window.history.pushState(null, slug, slug);

  const peerConnOpts = {};
  const localConn = new RTCPeerConnection(peerConnOpts);
  const publishChannel = localConn.createDataChannel(slug, {  });

  global['localConn'] = localConn;

  publishChannel.onopen = () => {
    console.log('channel open');
  };

  publishChannel.onclose = () => {
    console.log('channel closed');
  };

  const candidates: Array<string> = [];
  let session: string;

  localConn.onicecandidate = (evt) => {
    console.log('pub local conn got ice candidate', evt.candidate);
    if (evt.candidate === null) {
      return;
    }
    candidates.push(JSON.stringify(evt.candidate));
  }

  localConn.createOffer().then((arg) => {
    console.log('pub local conn created offer', arg);
    session = JSON.stringify(arg);
    localConn.setLocalDescription(arg);
  });

  sub.on('data', (evt: any) => {
    console.log('got local message', evt);
    if (evt.remote) {
      hub.broadcast(slug, {session});
      hub.broadcast(slug, {candidates});
    } else if (evt.remoteSession) {
      console.log('got remote description', evt);
      localConn.setRemoteDescription(new RTCSessionDescription(JSON.parse(evt.remoteSession)));
    } else if (evt.remoteCandidate) {
      localConn.addIceCandidate(new RTCIceCandidate(JSON.parse(evt.remoteCandidate)));
    }
  });

  return (text: string) => {
    if (publishChannel.readyState === 'open') {
      publishChannel.send(text);
    } else {
      console.log('channel not open yet');
    }
  };
}


export function subscribe(callback: Function) {
  const slug = window.location.pathname.slice(1);
  const remoteConn = new RTCPeerConnection({});
  global['remoteConn'] = remoteConn;

  // let channel: RTCDataChannel;

  remoteConn.ondatachannel = (evt) => {
    console.log('on data channel', evt.channel);
    evt.channel.onopen = () => {
      console.log('remote chann open');
    };

    evt.channel.onmessage = (evt) => callback(evt.data);
  };

  remoteConn.onicecandidate = (evt) => {
    if (evt.candidate) {
      hub.broadcast(slug, {
        remoteCandidate: JSON.stringify(evt.candidate)
      });
    }
  }

  hub.subscribe(slug).on('data', (evt: object) => {
    console.log('got remote message', evt);
    if (evt['session']) {
      console.log('setting remote session');
      remoteConn.setRemoteDescription(new RTCSessionDescription(JSON.parse(evt['session'])))
        .then(() => remoteConn.createAnswer())
        .then((ses) => {
          remoteConn.setLocalDescription(ses)
          hub.broadcast(slug, { remoteSession: JSON.stringify(ses) });
        });
    } else if (evt['candidates']) {
      console.log('setting candidates');
      evt['candidates'].forEach((c: any) => {
        remoteConn.addIceCandidate(new RTCIceCandidate(JSON.parse(c)));
      });
    }
  });

  hub.broadcast(slug, {remote: true});
}

export function shouldWatch() {
  return window.location.pathname !== '/';
}

function generateUrl() {
  return Math.random().toString(16).slice(2);
}
