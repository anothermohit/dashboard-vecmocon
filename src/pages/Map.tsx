import React from 'react';
import { connect } from 'react-redux';
import Breadcrumb from '../components/Breadcrumb';
import DeviceMap from '../components/DeviceMap.jsx';

const deviceLocations = [
  { latitude: 37.7749, longitude: -122.4194, deviceId: 'Device1' },
  { latitude: 34.0522, longitude: -118.2437, deviceId: 'Device2' },
  // Add more device locations as needed
];

const Map = (props) => {
  const { dataItems } = props;
  console.log(dataItems)
  return (
    <>
      <ul>
        {dataItems.map((item, index) => (
          <li key={index}>{item.someProperty /* Replace with the actual property you want to display */}</li>
        ))}
      </ul>
      <Breadcrumb pageName="Map" />

      {/* Your map rendering code */}
      <DeviceMap deviceLocations={deviceLocations} />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    dataItems: state.data.dataItems, // Make sure the path is correct
  };
};

export default connect(mapStateToProps)(Map);
