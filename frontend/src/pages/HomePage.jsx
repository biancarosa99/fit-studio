import React from "react";
import FitnessClassesCarousel from "../components/FitnessClassesCarousel";
import HomeInfoContainer from "../components/HomeInfoContainer";
import FitHubLocationsMap from "./FitHubLocationsMap";

const HomePage = () => {
  return (
    <React.Fragment>
      <HomeInfoContainer />
      <FitnessClassesCarousel />
      <FitHubLocationsMap />
    </React.Fragment>
  );
};

export default HomePage;
