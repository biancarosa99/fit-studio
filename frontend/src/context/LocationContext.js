import { createContext, useEffect, useState } from "react";

const LocationContext = createContext(null);

function getInitialState() {
  const currentLocation = localStorage.getItem("location");
  if (currentLocation) {
    const location = JSON.parse(currentLocation);

    return location;
  }

  return null;
}

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(getInitialState);

  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem("location", JSON.stringify(currentLocation));
    }
  }, [currentLocation]);

  return (
    <LocationContext.Provider value={{ currentLocation, setCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
