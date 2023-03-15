import React from "react";
import FitnessClassesCarousel from "../components/FitnessClassesCarousel";
import HomeInfoContainer from "../components/HomeInfoContainer";

const HomePage = () => {
  return (
    <React.Fragment>
      <HomeInfoContainer />
      <FitnessClassesCarousel />
    </React.Fragment>
  );
};

export default HomePage;
