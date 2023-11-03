// redux/reducers/deviceReducer.js
const initialState = {
    devices: {}, // Store device states by deviceId
  };
  
  const deviceReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_DEVICE_STATE':
        const { deviceId, deviceState } = action.payload;
        return {
          ...state,
          devices: {
            ...state.devices,
            [deviceId]: deviceState,
          },
        };
      default:
        return state;
    }
  };
  
  export default deviceReducer;
  