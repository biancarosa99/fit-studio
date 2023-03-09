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
  const center = useMemo(() => ({ lat: 45.7902454, lng: 21.2278635 }));
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
  }, []);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const res = await axios.get("/location/");
        setFitHubLocations(res.data);
        console.log(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getLocations();
  }, []);

  const onLoad = React.useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    // map.fitBounds(bounds);

    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const getLatLong = (location) => {
    return {
      lat: Number(location.lat),
      lng: Number(location.lng),
    };
  };

  const calculateRoute = async () => {
    const destination = { lat: 45.701755, lng: 21.2346449 };
    const directionsService = new window.google.maps.DirectionsService();
    const results = await directionsService.route({
      origin: center,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    setDirections(results);
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
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <MarkerF position={center} />
          {fitHubLocations.map((fitHubLocation) => {
            const fitHubPosition = getLatLong(fitHubLocation);
            console.log(fitHubPosition);
            return (
              <MarkerF
                key={fitHubLocation.id}
                position={fitHubPosition}
                onClick={calculateRoute}
              />
            );
          })}
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      ) : (
        <div>nup</div>
      )}
    </div>
  );
};

export default Map;
