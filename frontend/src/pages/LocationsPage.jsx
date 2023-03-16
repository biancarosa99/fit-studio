import { Grid } from "@mui/material";
import React from "react";
import Map from "../components/Map";
import LocationCard from "../components/LocationCard";
import "../styles/LocationsPage.css";

const LocationsPage = () => {
  return (
    <div style={{ padding: "50px" }}>
      <Grid container>
        <Grid item xs={12} md={4}>
          <div>
            <LocationCard />
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
