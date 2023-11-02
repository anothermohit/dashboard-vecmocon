import Breadcrumb from '../components/Breadcrumb';
import React from 'react';
import { useParams } from 'react-router-dom';
import DeviceMap from '../components/DeviceMap.jsx';

const deviceLocations = [
    { latitude: 37.7749, longitude: -122.4194, deviceId: 'Device1' },
    { latitude: 34.0522, longitude: -118.2437, deviceId: 'Device2' },
    // Add more device locations as needed
  ];

const Map = () => {
  return (
    <>
      <Breadcrumb pageName="Map" />

      {/* <!-- ====== Map Section Start ====== --> */}
      <div style={{maxWidth: '100%', height: 600}} className="w-full max-w-full rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <DeviceMap deviceLocations={deviceLocations} />
      </div>
      {/* <!-- ====== Map Section End ====== --> */}
    </>
  );
};

export default Map;
