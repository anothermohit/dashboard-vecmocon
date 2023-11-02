import React from 'react';
import { useParams } from 'react-router-dom';
import DeviceMap from './DeviceMap.jsx';

const deviceLocations = [
    { latitude: 37.7749, longitude: -122.4194, deviceId: 'Device1' },
    { latitude: 34.0522, longitude: -118.2437, deviceId: 'Device2' },
    // Add more device locations as needed
  ];

const DeviceDetails = () => {
  // Use the useParams hook to access route parameters
  const { deviceId } = useParams();

  return (
    <div>
      <p>Device ID: {deviceId}</p>
      <DeviceMap deviceLocations={deviceLocations} />
      {/* Add more details here */}
      
    </div>
  );
};

export default DeviceDetails;