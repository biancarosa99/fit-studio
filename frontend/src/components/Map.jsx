import React, { useContext, useEffect, useState } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  DirectionsRenderer,
} from "@react-google-maps/api";
import "../styles/Map.css";
import LocationContext from "../context/LocationContext";
import MapControl from "./MapControl";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import NearMeDisabledIcon from "@mui/icons-material/NearMeDisabled";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_API_KEY;

const containerStyle = {
  width: "100%",
  height: "500px",
};

const Map = ({ fitHubLocations }) => {
  const {
    currentDirections,
    setCurrentDirections,
    setDistance,
    setDuration,
    travelMode,
  } = useContext(LocationContext);
  const [center, setCenter] = useState({ lat: 45.7488716, lng: 21.2086793 });
  const [map, setMap] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    getUserLocation();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (currentDirections) {
      const fitHubPosition = getLatLong(currentDirections);
      calculateRoute(fitHubPosition);
    }
    // eslint-disable-next-line
  }, [currentDirections, travelMode]);

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

  const successLocationCallback = (position) => {
    const userLocation = {
      lat: Number(position.coords.latitude),
      lng: Number(position.coords.longitude),
    };
    setCenter(userLocation);
  };

  const errorLocationCallback = (error) => {
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
        successLocationCallback,
        errorLocationCallback,
        geolocationOptions
      );
      console.log(navigator);
    } else {
      console.log("You dod not enable geolocation");
      // code for user not enabled geolocaton permission
    }
  };

  const calculateRoute = async (position) => {
    const directionsService = new window.google.maps.DirectionsService();

    setDirections(null);
    const results = await directionsService.route({
      origin: center,
      destination: position,
      travelMode: window.google.maps.TravelMode[travelMode],
      provideRouteAlternatives: true,
    });

    setDirections(results);
    console.log(results.routes);
    setDistance(results.routes[0].legs[0].distance.text);
    setDuration(results.routes[0].legs[0].duration.text);
  };

  const centerMap = () => {
    map.panTo(center);
  };

  const clearRoute = () => {
    setDirections(null);
    centerMap();
    setCurrentDirections(null);
  };

  return (
    <div>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={11}
          onLoad={(map) => setMap(map)}
          options={{ disableDefaultUI: true }}
        >
          <MarkerF position={center} />
          {fitHubLocations &&
            fitHubLocations.map((fitHubLocation) => {
              const fitHubPosition = getLatLong(fitHubLocation);
              return (
                <MarkerF
                  key={fitHubLocation.id}
                  position={fitHubPosition}
                  onClick={() => setCurrentDirections(fitHubLocation)}
                  label={{
                    text: fitHubLocation.name,
                    color: "#f45b69",
                    fontWeight: "bold",
                  }}
                  icon={{
                    url: "/fithublogo3.png",
                    scaledSize: new window.google.maps.Size(70, 30),
                    labelOrigin: new window.google.maps.Point(40, 35),
                  }}
                />
              );
            })}
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{ suppressMarkers: true }}
            />
          )}
          <MapControl position="RIGHT_BOTTOM">
            {directions && (
              <div className="map-control-button" onClick={clearRoute}>
                <NearMeDisabledIcon fontSize="small" />
              </div>
            )}

            <div className="map-control-button" onClick={centerMap}>
              <GpsFixedIcon fontSize="small" />
            </div>
          </MapControl>
        </GoogleMap>
      ) : (
        <div>nup</div>
      )}
    </div>
  );
};

export default Map;
