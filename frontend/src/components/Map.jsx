import React, { useEffect, useMemo, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker } from "@react-google-maps/api";
import axios from "axios";
import "../styles/Map.css";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_API_KEY;

const containerStyle = {
  width: "700px",
  height: "500px",
};

const Map = () => {
  const center = useMemo(() => ({ lat: 45.7902454, lng: 21.2278635 }), []);
  const [map, setMap] = useState(null);
  const [fitHubLocations, setFitHubLocations] = useState([]);

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

  const handleClick = (position) => {
    console.log("clicked: " + Object.values(position));
  };

  const getLatLong = (location) => {
    return {
      lat: Number(location.lat),
      lng: Number(location.lng),
    };
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
          <Marker position={center} />
          {fitHubLocations.map((fitHubLocation) => {
            const fitHubPosition = getLatLong(fitHubLocation);
            return (
              <Marker
                key={fitHubLocation.id}
                position={fitHubPosition}
                onClick={() => handleClick(fitHubPosition)}
              />
            );
          })}
        </GoogleMap>
      ) : (
        <div>nup</div>
      )}
    </div>
  );
};

export default Map;
