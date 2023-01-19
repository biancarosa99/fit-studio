import React from "react";
import "../styles/HomeInfoContainer.css";
import fitnessIMG from "../assets/women-fitness.jpg";
import { useMediaQuery } from "react-responsive";
import { useNavigate } from "react-router-dom";

const HomeInfoContainer = () => {
  const isDesktop = useMediaQuery({ query: "(min-width: 451px)" });
  const isMobile = useMediaQuery({ query: "(max-width: 450px)" });

  const navigate = useNavigate();

  return (
    <React.Fragment>
      {isDesktop && (
        <div className="info-container">
          <div className="wrapper">
            <div className="image-container">
              <img className="fitness-img" src={fitnessIMG} alt="fitness" />
            </div>
            <div className="text-container">
              <div className="title">SHAPE YOURSELF</div>
              <div className="description">
                Our club encourages wellness by providing first-class
                instructors, innovative classes, and qualified staff.
              </div>
              <button
                className="button"
                onClick={() => navigate("/classesTimetable")}
              >
                START NOW
              </button>
            </div>
          </div>
        </div>
      )}
      {isMobile && (
        <div className="info-mobile-container">
          <div className="wrapper">
            <div className="text-container">
              <div className="title">SHAPE YOURSELF</div>
              <div className="description">
                Our club encourages wellness by providing first-class
                instructors, innovative classes, and qualified staff.
              </div>
              <button
                className="button"
                onClick={() => navigate("/classesTimetable")}
              >
                START NOW
              </button>
            </div>
            <div className="image-container">
              <img className="fitness-img" src={fitnessIMG} alt="fitness" />
            </div>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default HomeInfoContainer;
