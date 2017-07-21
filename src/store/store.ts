import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import loggerMiddleware from 'redux-logger'

import rootReducer from './reducers'
import rootSaga from './sagas'

const sagaMiddleware = createSagaMiddleware()

const store = createStore(rootReducer,
  applyMiddleware(loggerMiddleware, sagaMiddleware))

sagaMiddleware.run(rootSaga)

export default store
