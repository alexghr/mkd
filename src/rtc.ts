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

  let session: string;

  localConn.onicecandidate = (evt) => {
    console.log('pub local conn got ice candidate', evt.candidate);
  }

  localConn.createOffer().then((arg) => {
    console.log('pub local conn created offer', arg);
    session = JSON.stringify(arg);
    localConn.setLocalDescription(arg);
  });

  sub.on('data', (evt: any) => {
    console.log('got local message', evt);
    if (evt.remote) {
      hub.broadcast(slug, {session: JSON.stringify(localConn.localDescription)});
    } else if (evt.remoteSession) {
      console.log('got remote description', evt);
      localConn.setRemoteDescription(new RTCSessionDescription(JSON.parse(evt.remoteSession)));
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

  remoteConn.ondatachannel = (evt) => {
    console.log('on data channel', evt.channel);
    evt.channel.onopen = () => {
      console.log('remote chann open');
    };

    evt.channel.onmessage = (evt) => callback(evt.data);
  };

  remoteConn.onicecandidate = (evt) => {
    console.log('remote ice candidate', evt);
  }

  hub.subscribe(slug).on('data', (evt: object) => {
    console.log('got remote message', evt);
    if (evt['session']) {
      console.log('setting remote session');
      remoteConn.setRemoteDescription(new RTCSessionDescription(JSON.parse(evt['session'])))
        .then(() => remoteConn.createAnswer())
        .then((ses) => {
          remoteConn.setLocalDescription(ses)
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
