import React from "react";
import FitnessClassesCarousel from "../components/FitnessClassesCarousel";
import HomeInfoContainer from "../components/HomeInfoContainer";
import Map from "../components/Map";

const HomePage = () => {
  return (
    <React.Fragment>
      <HomeInfoContainer />
      <FitnessClassesCarousel />
      <Map />
    </React.Fragment>
  );
};

export default HomePage;
