import { combineReducers } from 'redux';

import slugReducer from './slug';

const rootReducer = combineReducers({
  slug: slugReducer
});

export default rootReducer;
