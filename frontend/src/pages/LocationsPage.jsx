import { Grid } from "@mui/material";
import React from "react";
import Map from "../components/Map";
import "../styles/LocationsPage.css";
import LocationsCarousel from "../components/LocationsCarousel";

const LocationsPage = () => {
  return (
    <div style={{ padding: "50px" }}>
      <Grid container spacing={5}>
        <Grid item xs={12} md={4}>
          <div>
            <LocationsCarousel />
          </div>
        </Grid>
        <Grid item xs={12} md={8}>
          <Map />
        </Grid>
      </Grid>
    </div>
  );
};

export default LocationsPage;
