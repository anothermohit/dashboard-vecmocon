import React from 'react';
import { connect } from 'react-redux';
import Breadcrumb from '../components/Breadcrumb';
import DeviceMap from '../components/DeviceMap.jsx';
import AWSData from '../aws.data.jsx';
import MQTT311 from '../PubSub.js';

const deviceLocations = [
  { latitude: 37.7749, longitude: -122.4194, deviceId: 'Device1' },
  { latitude: 34.0522, longitude: -118.2437, deviceId: 'Device2' },
  // Add more device locations as needed
];

const Map = (props) => {
  const { dataItems, devices } = props; // Collect deviceState from props
  console.log(dataItems, devices);

  return (
    <div>
      <Breadcrumb pageName="Map" />
      <DeviceMap devices={devices} /> {/* Pass deviceState as a prop */}
      <AWSData />
      <div>
        {dataItems.slice(0, 1).map((client, index) => (
          <div key={index}>
            {client.deviceRegistered.slice(0, 3).map((deviceId, i) => (
              <MQTT311 key={i} deviceId={deviceId} />
            ))}
          </div>
        ))}
      </div>
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
