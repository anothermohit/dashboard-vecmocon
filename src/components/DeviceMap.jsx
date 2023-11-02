import React, { useEffect, useState } from 'react';
import VehicleMarkerImage from './vehicle.webp';

const GOOGLE_MAPS_API_KEY = 'AIzaSyANXtr2-kBxYf1O2_HyNDjn2PhKWMZLJIc';

const DeviceMap = ({ deviceState }) => {
  const [map, setMap] = useState(null);
  const [deviceMarker, setDeviceMarker] = useState(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 20.5937, lng: 78.9629 },
      zoom: 10,
      styles: [
        {
          featureType: 'all',
          stylers: [{ hue: '#34576F' }, { saturation: 5 }],
        },
        {
          featureType: 'road',
          stylers: [{ hue: '#1B2434' }, { saturation: -100 }],
        },
      ],
    });

    setMap(mapInstance);
  };

  useEffect(() => {
    if (map && deviceState && deviceState.reported && deviceState.reported.gps) {
      const deviceLocation = {
        latitude: deviceState.reported.gps[1],
        longitude: deviceState.reported.gps[2],
        deviceId: deviceState.reported.deviceInfo[1],
      };

      if (deviceLocation.latitude && deviceLocation.longitude) {
        const deviceCenter = {
          lat: Number(deviceLocation.latitude),
          lng: Number(deviceLocation.longitude),
        };

        // Update the map center
        map.setCenter(deviceCenter);

        // Add markers for device locations
        addDeviceMarker(deviceCenter);
      }
    }
  }, [map, deviceState]);

  const addDeviceMarker = (position) => {
    if (deviceMarker) {
      // If a marker already exists, update its position
      deviceMarker.setPosition(position);
    } else {
      // Create a new marker
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: 'Device Location',
        icon: {
            url: VehicleMarkerImage, // Set the custom image URL
            scaledSize: new window.google.maps.Size(50, 50), // Adjust the size as needed
          },
      });
      setDeviceMarker(marker);
    }
  };

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default DeviceMap;
