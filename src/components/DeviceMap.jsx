import React, { useEffect } from 'react';

// Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual API key
const GOOGLE_MAPS_API_KEY = 'AIzaSyANXtr2-kBxYf1O2_HyNDjn2PhKWMZLJIc';

const DeviceMap = ({ deviceLocations }) => {
  useEffect(() => {
    // Load the Google Maps JavaScript API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}`;
    script.async = true;
    script.defer = true;
    script.onload = initializeMap;
    document.head.appendChild(script);

    return () => {
      // Clean up the script element
      document.head.removeChild(script);
    };
  }, []);

  const initializeMap = () => {
    // Initialize the map
    const indiaCenter = { lat: 20.5937, lng: 78.9629 };
    const map = new window.google.maps.Map(document.getElementById('map'), {
      center: indiaCenter, // Set the initial map center
      zoom: 4.75, // Adjust the initial zoom level
      styles: [
        {
          featureType: 'all',
          stylers: [
            { hue: '#34576F' },
            { saturation: 5 }
          ]
        },
        {
          featureType: 'road',
          stylers: [
            { hue: '#1B2434' },
            { saturation: -100 }
          ]
        }
      ]
    });

    // Add markers for device locations
    deviceLocations.forEach((location) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.latitude, lng: location.longitude },
        map: map,
        title: location.deviceId, // Set a title for the marker
      });

      // You can customize the marker appearance here

      // Add an info window to the marker with device information
      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div><strong>Device ID:</strong> ${location.deviceId}</div>`,
      });

      // Open the info window when the marker is clicked
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
    });
  };

  return (
    <div>
      <div id="map" style={{ height: '600px', width: '100%' }}></div>
    </div>
  );
};

export default DeviceMap;
