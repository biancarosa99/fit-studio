import React, { useContext, useState } from "react";
import "../styles/Footer.css";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import PhoneIcon from "@mui/icons-material/Phone";
import axios from "axios";
import { useEffect } from "react";
import LocationContext from "../context/LocationContext";

const Footer = () => {
  const { currentLocation, setCurrentLocation } = useContext(LocationContext);

  const [locations, setLocations] = useState([]);

  const getLocations = async () => {
    try {
      const res = await axios.get("/location/");
      setLocations(res.data);
      if (!currentLocation) {
        setCurrentLocation(res.data[0]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLocations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <h4 className="footer-column-title">LOCATIONS</h4>

            <ul className="footer-column-list">
              {locations.map((location, index) => (
                <li
                  className="footer-column-list-item"
                  key={index}
                  onClick={() => setCurrentLocation(location)}
                >
                  <a href="/classesTimetable">
                    <LocationOnOutlinedIcon sx={{ fontSize: 21 }} />
                    <span>{location.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">CONTACT</h4>
            <ul className="footer-column-list">
              <li className="footer-column-list-item">
                <a href="mailto:contact@fithub.com">
                  <MailOutlineIcon sx={{ fontSize: "large" }} />
                  <span>contact@fithub.com</span>
                </a>
              </li>
              <li className="footer-column-list-item">
                <a href="#something">
                  <PhoneIcon sx={{ fontSize: "large" }} />{" "}
                  <span>0734678122</span>
                </a>
              </li>
              <li className="footer-column-list-item">
                <a href="#something">
                  <PhoneIcon sx={{ fontSize: "large" }} />{" "}
                  <span>0356199199</span>
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h4 className="footer-column-title">FOLLOW US</h4>
            <ul className="footer-column-list">
              <div className="social-links">
                <a
                  href="https://www.facebook.com/FithubFagaras"
                  target="_blank"
                  rel="noreferrer"
                >
                  <FacebookOutlinedIcon />
                </a>
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <InstagramIcon />
                </a>
                <a
                  href="https://twitter.com/?lang=en"
                  target="_blank"
                  rel="noreferrer"
                >
                  <TwitterIcon />
                </a>
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <LinkedInIcon />
                </a>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
