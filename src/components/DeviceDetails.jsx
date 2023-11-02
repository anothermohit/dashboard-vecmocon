import React from 'react';
import { useParams } from 'react-router-dom';
import AwsData from '../aws.data.jsx';
import MQTT311 from '../PubSub.tsx';

const DeviceDetails = () => {
  // Use the useParams hook to access route parameters
  const { deviceId } = useParams();

  return (
    <div>
      <MQTT311 deviceId={deviceId} />
    </div>
  );
};

export default DeviceDetails;