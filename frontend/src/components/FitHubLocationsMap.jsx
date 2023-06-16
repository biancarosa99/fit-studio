import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Map from "../components/Map";
import "../styles/FitHubLocationsMap.css";
import LocationsCarousel from "./LocationsCarousel";
import axios from "axios";

const FitHubLocationsMap = () => {
  const [fitHubLocations, setFitHubLocations] = useState([]);

  useEffect(() => {
    const getLocations = async () => {
      try {
        const res = await axios.get("/location/");
        setFitHubLocations(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getLocations();
  }, []);

  return (
    <div className="fithub-locations-map-grid-container">
      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <div>
            <LocationsCarousel fitHubLocations={fitHubLocations} />
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <Map fitHubLocations={fitHubLocations} />
        </Grid>
      </Grid>
    </div>
  );
};

export default FitHubLocationsMap;
