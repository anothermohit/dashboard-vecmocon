// redux/actions/deviceActions.js
export const updateDeviceState = (deviceId, deviceState) => {
    return {
      type: 'UPDATE_DEVICE_STATE',
      payload: { deviceId, deviceState },
    };
  };