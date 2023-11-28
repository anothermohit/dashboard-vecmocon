import React, { useEffect, useState } from 'react';
import VehicleMarkerImage from './vehicle.webp';

const GOOGLE_MAPS_API_KEY = 'AIzaSyANXtr2-kBxYf1O2_HyNDjn2PhKWMZLJIc';

const DeviceMap = () => {
  const [map, setMap] = useState(null);
  const [deviceMarkers, setDeviceMarkers] = useState({});
  const [geofenceCircle, setGeofenceCircle] = useState(null);

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
    if (window.google) {
      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        zoom: 15,
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
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
        },
      });

      // Set the center to Delhi
      const delhiCenter = new window.google.maps.LatLng(28.6139, 77.2090);
      mapInstance.setCenter(delhiCenter);

      // Add a geofence circle
      const geofenceRadius = 1000; // 1 km
      const circle = new window.google.maps.Circle({
        center: delhiCenter,
        radius: geofenceRadius,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35,
        map: mapInstance,
      });

      setGeofenceCircle(circle);

      // Add a dummy vehicle in the center of Delhi
      const dummyVehicle = {
        id: 'dummyVehicle',
        speed: 0.0005, // Adjust speed as needed
        position: { lat: 28.6139, lng: 77.2090 },
      };

      simulateVehicleMovement(mapInstance, dummyVehicle);
      setMap(mapInstance);
    } else {
      // Handle the case where the Google Maps API is not yet loaded
    }
  };

  // immobalize
// immobalize
const simulateVehicleMovement = (mapInstance, vehicle) => {
  let movementInterval;
  let updateCounter = 0;
  let reduceSpeed = false; // Flag to control speed reduction

  movementInterval = setInterval(() => {
    const newLat = vehicle.position.lat;
    let newLng;

    // Reduce speed to 10% after the 22nd update
    if (reduceSpeed) {
      newLng = vehicle.position.lng + vehicle.speed * 0.1;
    } else {
      newLng = vehicle.position.lng + vehicle.speed;
    }

    const newVehiclePosition = { lat: newLat, lng: newLng };

    if (
      geofenceCircle &&
      window.google.maps.geometry.spherical.computeDistanceBetween(
        geofenceCircle.getCenter(),
        new window.google.maps.LatLng(newLat, newLng)
      ) > geofenceCircle.getRadius()
    ) {
      clearInterval(movementInterval);
      alert('Dummy vehicle breached the geofence boundary!');
      clearMarkers(); // Clear markers when the boundary is breached
    }

    updateCounter++;
    if (updateCounter === 22 && !reduceSpeed) {
      alert('Dummy vehicle reached the maximum number of updates!');
      reduceSpeed = true; // Set the flag to reduce speed after the alert is acknowledged
    } else if (updateCounter >= 60) {
      clearInterval(movementInterval);
      clearMarkers();
    }

    updateVehicleMarker(mapInstance, vehicle.id, newVehiclePosition);

    vehicle.position.lat = newLat;
    vehicle.position.lng = newLng;
  }, 100);

  // Function to clear markers
  const clearMarkers = () => {
    Object.values(deviceMarkers).forEach((marker) => marker.setMap(null));
    setDeviceMarkers({});
  };

  // Cleanup markers and interval when component unmounts
  useEffect(() => {
    return () => {
      clearMarkers();
      clearInterval(movementInterval);
    };
  }, []);
};


  const updateVehicleMarker = (mapInstance, vehicleId, newPosition, interval) => {
    const newMarker = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(newPosition.lat, newPosition.lng),
      map: mapInstance,
      title: vehicleId,
      icon: {
        url: VehicleMarkerImage,
        scaledSize: new window.google.maps.Size(25, 25),
      },
    });
  
    // Remove all previous markers
    Object.values(deviceMarkers).forEach((prevMarker) => {
      prevMarker.setMap(null);
    });
  
    // Set the new marker by merging with the existing markers
    setDeviceMarkers({ [vehicleId]: newMarker });
  
    // Check if the new position is outside the geofence boundary
    if (
      geofenceCircle &&
      window.google.maps.geometry.spherical.computeDistanceBetween(
        geofenceCircle.getCenter(),
        new window.google.maps.LatLng(newPosition.lat, newPosition.lng)
      ) > geofenceCircle.getRadius()
    ) {
      clearInterval(interval);
      //alert('Dummy vehicle breached the geofence boundary!!!');
    }
  };
  

  // Cleanup markers when deviceMarkers changes
  useEffect(() => {
    return () => {
      Object.values(deviceMarkers).forEach((marker) => marker.setMap(null));
    };
  }, [deviceMarkers]);

  return <div id="map" style={{ width: '100%', height: '400px' }}></div>;
};

export default DeviceMap;
