// redux/store.js
import { legacy_createStore as createStore, combineReducers } from 'redux';
import dataReducer from './reducers/dataReducer';
import deviceReducer from './reducers/deviceReducer';

const rootReducer = combineReducers({
  data: dataReducer,
  device: deviceReducer
});

const store = createStore(rootReducer);

export default store;
