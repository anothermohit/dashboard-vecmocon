// redux/store.js
import { legacy_createStore as createStore, combineReducers } from 'redux';
import dataReducer from './reducers/dataReducer';
import deviceReducer from './reducers/deviceReducer';
import mqttReducer from './reducers/mqttReducer';
import seriesReducer from './reducers/seriesReducer';
import authReducer from './reducers/authReducer';

const rootReducer = combineReducers({
  data: dataReducer,
  device: deviceReducer,
  mqtt: mqttReducer,
  series: seriesReducer,
  auth: authReducer,
});

const store = createStore(rootReducer);

export default store;
