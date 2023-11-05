export const updateMqttState = (connection) => {
    return {
      type: 'UPDATE_MQTT_STATE',
      payload: connection,
    };
  };
  