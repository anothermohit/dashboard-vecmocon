import React, { useEffect, useState } from 'react';
import VehicleMarkerImage from './vehicle.webp';
import Swal from 'sweetalert2';
import { speed } from 'jquery';

const GOOGLE_MAPS_API_KEY = 'AIzaSyANXtr2-kBxYf1O2_HyNDjn2PhKWMZLJIc';

const DeviceMap = () => {
  const [map, setMap] = useState(null);
  const [deviceMarkers, setDeviceMarkers] = useState({});
  const [geofenceCircle, setGeofenceCircle] = useState(null);
  const [speedFactor, setSpeedFactor] = useState(0.2);

  console.log(speedFactor)
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

  const showAlert = (message, type = 'info') => {
    Swal.fire({
      icon: type,
      title: message,
    });
  };

  const handleSpeedFactorChange = () => {
    Swal.fire({
      icon: 'warning',
      title: 'Geofence boundary breached! Set Speed Factor',
      input: 'number',
      inputValue: speedFactor,
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value || value <= 0) {
          return 'Please enter a valid speed factor greater than 0';
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        setSpeedFactor(parseFloat(result.value));
        showAlert(`Speed factor updated to ${result.value}`, 'success');
      }
    });
  };

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

      const delhiCenter = new window.google.maps.LatLng(28.6139, 77.2090);
      mapInstance.setCenter(delhiCenter);

      const geofenceRadius = 1000;
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

      const dummyVehicle = {
        id: 'dummyVehicle',
        speed: 0.0002,
        position: { lat: 28.6139, lng: 77.2090 },
      };

      simulateVehicleMovement(mapInstance, dummyVehicle, speedFactor);
      setMap(mapInstance);
    } else {
      // Handle the case where the Google Maps API is not yet loaded
    }
  };

  let movementInterval;

  const simulateVehicleMovement = (mapInstance, vehicle, speedFactor) => {
    let updateCounter = 0;
    let reduceSpeed = false;

    //speedFactor = this.state.speedFactor;
    movementInterval = setInterval(() => {
      const newLat = vehicle.position.lat;
      let newLng;

      console.log(speedFactor, updateCounter);
      if (reduceSpeed) {
        newLng = vehicle.position.lng + vehicle.speed * speedFactor;
      } else {
        newLng = vehicle.position.lng + vehicle.speed;
      }

      const newVehiclePosition = { lat: newLat, lng: newLng };

      updateCounter++;
      if (updateCounter === 50 && !reduceSpeed) {
        handleSpeedFactorChange();
        reduceSpeed = true;
      } else if (updateCounter >= 500) {
        clearInterval(movementInterval);
        clearMarkers();
      }

      updateVehicleMarker(mapInstance, vehicle.id, newVehiclePosition);

      vehicle.position.lat = newLat;
      vehicle.position.lng = newLng;
    }, 100);

    const clearMarkers = () => {
      Object.values(deviceMarkers).forEach((marker) => marker.setMap(null));
      setDeviceMarkers({});
    };
  };
  const updateVehicleMarker = (mapInstance, vehicleId, newPosition) => {
    const newMarker = new window.google.maps.Marker({
      position: new window.google.maps.LatLng(newPosition.lat, newPosition.lng),
      map: mapInstance,
      title: vehicleId,
      icon: {
        url: VehicleMarkerImage,
        scaledSize: new window.google.maps.Size(25, 25),
      },
    });

    Object.values(deviceMarkers).forEach((prevMarker) => {
      prevMarker.setMap(null);
    });

    setDeviceMarkers({ [vehicleId]: newMarker });

    if (
      geofenceCircle &&
      window.google.maps.geometry.spherical.computeDistanceBetween(
        geofenceCircle.getCenter(),
        new window.google.maps.LatLng(newPosition.lat, newPosition.lng)
      ) > geofenceCircle.getRadius()
    ) {
      clearInterval(movementInterval);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(deviceMarkers).forEach((marker) => marker.setMap(null));
    };
  }, [deviceMarkers]);

  return (
    <div id="map" style={{ width: '100%', height: '600px' }}>
      {/* ... (existing code) */}
    </div>
  );
};

export default DeviceMap;
