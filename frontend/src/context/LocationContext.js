import axios from "axios";
import { createContext, useEffect, useState } from "react";

const LocationContext = createContext(null);

const getLocation = async () => {
  try {
    const res = await axios.get("/location/");
    console.log("footer refreshed");
    return res.data[0];
  } catch (error) {
    console.log(error);
  }
};

function getInitialState() {
  const currentLocation = localStorage.getItem("location");
  if (currentLocation) {
    const location = JSON.parse(currentLocation);

    return location;
  }

  const location = JSON.parse(getLocation());

  return location;
}

export const LocationProvider = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState(getInitialState);

  useEffect(() => {
    if (currentLocation) {
      localStorage.setItem("location", JSON.stringify(currentLocation));
    } else {
      localStorage.clear();
    }
  }, [currentLocation]);

  return (
    <LocationContext.Provider value={{ currentLocation, setCurrentLocation }}>
      {children}
    </LocationContext.Provider>
  );
};

export default LocationContext;
