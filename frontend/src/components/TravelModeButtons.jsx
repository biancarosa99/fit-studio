import React, { useContext, useEffect } from "react";
import "../styles/TravelModeButton.css";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import { TRAVEL_MODES } from "../assets/GoogleMapsTravelModes";
import LocationContext from "../context/LocationContext";

const TravelModeButtons = ({ showActiveButton }) => {
  const { travelMode, setTravelMode } = useContext(LocationContext);
  const [activeButton, setActiveButton] = React.useState(travelMode);

  const changeTravelModeHandler = (travelModeOption) => {
    setTravelMode(travelModeOption);
  };

  useEffect(() => {
    setActiveButton(travelMode);
  }, [travelMode]);

  return (
    <div className="travel-options-container">
      <button
        className={
          showActiveButton && activeButton === TRAVEL_MODES.DRIVING
            ? "travel-option-button active"
            : "travel-option-button"
        }
        onClick={() => changeTravelModeHandler(TRAVEL_MODES.DRIVING)}
      >
        <DirectionsCarIcon />
      </button>

      <button
        className={
          showActiveButton && activeButton === TRAVEL_MODES.WALKING
            ? "travel-option-button active"
            : "travel-option-button"
        }
        onClick={() => changeTravelModeHandler(TRAVEL_MODES.WALKING)}
      >
        <DirectionsWalkIcon />
      </button>
      {/* <button
        className={
          activeButton === TRAVEL_MODES.BICYCLING
            ? "travel-option-button active"
            : "travel-option-button"
        }
        onClick={() => changeTravelModeHandler(TRAVEL_MODES.BICYCLING)}
      >
        <DirectionsBikeIcon />
      </button> */}
    </div>
  );
};

export default TravelModeButtons;
