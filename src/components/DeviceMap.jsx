import React, { useEffect, useState } from 'react';
import VehicleMarkerImage from './vehicle.webp';

const GOOGLE_MAPS_API_KEY = 'AIzaSyANXtr2-kBxYf1O2_HyNDjn2PhKWMZLJIc';

const DeviceMap = ({ devices }) => {
  const [map, setMap] = useState(null);
  const [deviceMarkers, setDeviceMarkers] = useState({});
  const [mapBounds, setMapBounds] = useState(null);

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
    if (map && devices) {
      const bounds = new window.google.maps.LatLngBounds();

      for (const deviceId in devices) {
        if (devices.hasOwnProperty(deviceId) && devices[deviceId].reported.gps) {
          const deviceLocation = devices[deviceId].reported.gps;
          const lat = deviceLocation[1];
          const lng = deviceLocation[2];

          if (lat && lng) {
            const deviceCenter = new window.google.maps.LatLng(Number(lat), Number(lng));
            bounds.extend(deviceCenter);

            if (deviceMarkers[deviceId]) {
              // If a marker already exists, update its position
              deviceMarkers[deviceId].setPosition(deviceCenter);
            } else {
              // Create a new marker
              const marker = new window.google.maps.Marker({
                position: deviceCenter,
                map,
                title: deviceId,
                icon: {
                  url: VehicleMarkerImage, // Set the custom image URL
                  scaledSize: new window.google.maps.Size(25, 25), // Adjust the size as needed
                },
              });
              deviceMarkers[deviceId] = marker;
            }
          }
        }
      }

      // Set the map's viewport to fit the bounds of all markers
      if (bounds.getNorthEast().equals(bounds.getSouthWest())) {
        map.setCenter(bounds.getNorthEast());
      } else {
        map.fitBounds(bounds);
      }
    }
  }, [map, devices, deviceMarkers]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default DeviceMap;
