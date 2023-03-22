import React, { useContext, useEffect, useRef } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LocationCard from "./LocationCard";
import "../styles/LocationsCarousel.css";
import LocationContext from "../context/LocationContext";

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    />
  );
}

const LocationsCarousel = ({ fitHubLocations }) => {
  const { currentDirections } = useContext(LocationContext);
  const slider = useRef(null);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  useEffect(() => {
    const findSlideIndex = () => {
      const index = fitHubLocations?.findIndex(
        (fitHubLocation) => fitHubLocation?.id === currentDirections?.id
      );
      return index !== -1 ? index : 0;
    };
    const slideIndex = findSlideIndex();
    slider.current.slickGoTo(slideIndex);
  }, [currentDirections, fitHubLocations]);
  return (
    <div>
      <Slider {...settings} ref={slider}>
        {fitHubLocations &&
          fitHubLocations.map((location, index) => (
            <LocationCard key={index} location={location} />
          ))}
      </Slider>
    </div>
  );
};

export default LocationsCarousel;
