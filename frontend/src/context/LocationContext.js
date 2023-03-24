import { createContext, useEffect, useState } from "react";
import { TRAVEL_MODES } from "../assets/GoogleMapsTravelModes";

const LocationContext = createContext(null);

function getInitialLocation() {
  const currentLocation = localStorage.getItem("location");
  if (currentLocation) {
    const location = JSON.parse(currentLocation);

    return location;
  }

  return null;
}

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(getInitialLocation);
  const [currentDirections, setCurrentDirections] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [travelMode, setTravelMode] = useState(TRAVEL_MODES.DRIVING);

  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem("location", JSON.stringify(currentLocation));
    }
  }, [currentLocation]);

  // useEffect(() => {
  //   if (currentDirections) {
  //     localStorage.setItem("directions", JSON.stringify(currentDirections));
  //   }
  // }, [currentDirections]);

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        setCurrentLocation,
        currentDirections,
        setCurrentDirections,
        distance,
        setDistance,
        duration,
        setDuration,
        travelMode,
        setTravelMode,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
