import React from 'react';
import { useParams } from 'react-router-dom';

const DeviceDetails = () => {
  // Use the useParams hook to access route parameters
  const { deviceId } = useParams();

  return (
    <div>
      <h1>Device Details</h1>
      <p>Device ID: {deviceId}</p>
      {/* Add more details here */}
    </div>
  );
};

export default DeviceDetails;