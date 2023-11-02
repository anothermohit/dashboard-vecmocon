// redux/reducers/deviceReducer.js
const initialState = {
    deviceState: {},
  };
  
  const deviceReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'UPDATE_DEVICE_STATE':
        return {
          ...state,
          deviceState: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default deviceReducer;
  