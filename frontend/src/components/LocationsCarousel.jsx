import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import LocationCard from "./LocationCard";
import "../styles/LocationsCarousel.css";

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
  return (
    <div>
      <Slider {...settings}>
        {fitHubLocations &&
          fitHubLocations.map((location, index) => (
            <LocationCard
              key={index}
              id={location.id}
              locationName={location.name}
              locationAddress={location.address}
              location={location}
            />
          ))}
      </Slider>
    </div>
  );
};

export default LocationsCarousel;
