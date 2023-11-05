// redux/store.js
import { legacy_createStore as createStore, combineReducers } from 'redux';
import dataReducer from './reducers/dataReducer';
import deviceReducer from './reducers/deviceReducer';
import mqttReducer from './reducers/mqttReducer';

const rootReducer = combineReducers({
  data: dataReducer,
  device: deviceReducer,
  mqtt: mqttReducer
});

const store = createStore(rootReducer);

export default store;
