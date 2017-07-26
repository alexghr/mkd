import { Effect, takeEvery, take, call, select } from 'redux-saga/effects';
import { eventChannel, Channel } from 'redux-saga';

import * as sessionApi from '../api/session';
import { getSlug } from '../selectors';
import { Slug } from '../state';

function* listen(): Iterator<Effect> {
  const slug = yield select(getSlug);
  const channel = yield call(messageChannel, slug);

  console.log('listening');

  try {
    while (true) {
      const msg = yield take(channel);
      console.log('got a message', msg);
    }
  } finally {

  }
}

export default function* sessionSaga(): Iterator<Array<Effect>> {
  yield [
    takeEvery('listen', listen),
  ];
}

function messageChannel(slug: Slug): Channel<any> {
  return eventChannel(emitter => {
    const unsub = sessionApi.listenForMessages(slug, (data: any) => {
      emitter(data);
    });

    return unsub;
  });
}
