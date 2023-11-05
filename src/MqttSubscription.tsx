import { useEffect } from 'react';
import { mqtt } from 'aws-iot-device-sdk-v2';
import { useDispatch, useSelector } from 'react-redux';
import { updateDeviceState } from './redux/actions/deviceActions'; // Import your action to update deviceState

function MqttSubscription({ deviceId }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const testTopic = `/test/topic/${deviceId}`; // Modify the topic to include the device ID

    // Get the connection promise from the parent component, assuming you pass it as a prop

    connectionPromise.then((connection) => {
      connection.subscribe(testTopic, mqtt.QoS.AtLeastOnce, (topic, payload) => {
        const decoder = new TextDecoder('utf8');
        let message = decoder.decode(new Uint8Array(payload));
        let state = JSON.parse(message).state;
        dispatch(updateDeviceState(deviceId, state));
        console.log(state);
      });
    });
  }, [deviceId]);

  return null; // This component doesn't render anything
}

export default MqttSubscription;
