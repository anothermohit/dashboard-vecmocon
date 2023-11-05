const initialState = {
    connection: {},
  };
  
  const mqttReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_MQTT_STATE':
        return {
          ...state,
          connection: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default mqttReducer;
  