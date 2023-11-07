import React from 'react';
import { connect } from 'react-redux';
import Breadcrumb from '../components/Breadcrumb';
import DeviceMap from '../components/DeviceMap.jsx';
import AWSData from '../aws.data.jsx';
//import MqttConnection from '../MqttConnection.tsx';
//import MqttSubscription from '../MqttSubscription.tsx';
import MQTT311 from '../Mqtt311.js';

const deviceLocations = [
  { latitude: 37.7749, longitude: -122.4194, deviceId: 'Device1' },
  { latitude: 34.0522, longitude: -118.2437, deviceId: 'Device2' },
  // Add more device locations as needed
];

const Map = (props) => {
  const { dataItems, devices } = props; // Collect deviceState from props
  console.log(dataItems, devices);

  return (
    <div style={{paddingTop: 20, paddingBottom: 20}}>
      <AWSData /> {/* clientInfo as dataItems */}
      {dataItems.length ? <MQTT311 dataItems={dataItems} /> : null} {/* real-time state of every device in devices */}
      <DeviceMap devices={devices} /> {/* passing real-time state of all devices */}
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    dataItems: state.data.dataItems,
    devices: state.device.devices, // Modify to get all deviceStates
  };
};

export default connect(mapStateToProps)(Map);
