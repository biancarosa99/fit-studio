import React, { useEffect, useMemo, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import axios from "axios";
import "../styles/Map.css";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_API_KEY;

const containerStyle = {
  width: "700px",
  height: "500px",
};

const Map = () => {
  const [center, setCenter] = useState({ lat: 40.7127753, lng: -74.0059728 });
  const [map, setMap] = useState(null);
  const [fitHubLocations, setFitHubLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      console.log("Latitude is :", position.coords.latitude);
      console.log("Longitude is :", position.coords.longitude);
    });
    getUserLocation();
    console.log("Current position: " + center.lat, +" " + center.lng);
  }, []);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const res = await axios.get("/location/");
        setFitHubLocations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getLocations();
  }, []);

  // const onLoad = React.useCallback(function callback(map) {
  //   const bounds = new window.google.maps.LatLngBounds(center);
  //   // map.fitBounds(bounds);

  //   setMap(map);
  // }, []);

  // const onUnmount = React.useCallback(function callback(map) {
  //   setMap(null);
  // }, []);

  const getLatLong = (location) => {
    return {
      lat: Number(location.lat),
      lng: Number(location.lng),
    };
  };

  const successCallback = (position) => {
    const userLocation = {
      lat: Number(position.coords.latitude),
      lng: Number(position.coords.longitude),
    };
    setCenter(userLocation);
  };

  const errorCallback = (error) => {
    console.log("Browser does not support the Geolocation API");
  };

  const geolocationOptions = {
    enableHighAccuracy: true,
    maximumAge: 0,
    timeout: 5000,
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        successCallback,
        errorCallback,
        geolocationOptions
      );
    } else {
      // code for legacy browsers
    }
  };

  const clearRoute = () => {
    setDirections(null);
  };
  const calculateRoute = async (position) => {
    const directionsService = new window.google.maps.DirectionsService();
    clearRoute();
    const results = await directionsService.route({
      origin: center,
      destination: position,
      travelMode: window.google.maps.TravelMode.DRIVING,
      provideRouteAlternatives: true,
    });

    setDirections(results);
    console.log(results.routes);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  return (
    <div className="map-container">
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
          onLoad={() => setMap(map)}
        >
          {!directions && <MarkerF position={center} />}
          {fitHubLocations.map((fitHubLocation) => {
            const fitHubPosition = getLatLong(fitHubLocation);
            return (
              <MarkerF
                key={fitHubLocation.id}
                position={fitHubPosition}
                onClick={() => calculateRoute(fitHubPosition)}
              />
            );
          })}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      ) : (
        <div>nup</div>
      )}
      <button onClick={clearRoute}>Clear Route</button>
    </div>
  );
};

export default Map;
