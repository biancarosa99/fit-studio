import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Map from "../components/Map";
import "../styles/LocationsPage.css";
import LocationsCarousel from "../components/LocationsCarousel";
import axios from "axios";

const LocationsPage = () => {
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
    <div style={{ padding: "50px" }}>
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

export default LocationsPage;
