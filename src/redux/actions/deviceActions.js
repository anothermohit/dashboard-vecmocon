// redux/actions/deviceActions.js
export const updateDeviceState = (deviceState) => {
    return {
      type: 'UPDATE_DEVICE_STATE',
      payload: deviceState,
    };
  };