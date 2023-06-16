import React, { useState } from "react";
import "../styles/FitnessClassesCarousel.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import axios from "axios";
import { useEffect } from "react";

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

const FitnessClassesCarousel = () => {
  const [dbFitnessClasses, setDbFitnessClasses] = useState([]);

  const getFitnessClasses = async () => {
    try {
      const res = await axios.get("/fitnessClass/");
      setDbFitnessClasses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFitnessClasses();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    initialSlide: 0,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="slider-cnt">
      <Slider {...settings}>
        {dbFitnessClasses.map((fitnessClass) => (
          <div key={fitnessClass.id} className="card">
            <div className="card-container">
              <div className="image-cnt">
                <img src={fitnessClass.imgURL} alt={fitnessClass.name} />
              </div>
              <div className="card-bottom">
                <div className="class-description">
                  <h1>
                    {fitnessClass.name} - {fitnessClass.duration} min{" ("}
                    {fitnessClass.level}
                    {")"}
                  </h1>
                  <div>{fitnessClass.description}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default FitnessClassesCarousel;
