import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "../styles/LocationCard.css";
import "../styles/HomeInfoContainer.css";
import { Divider } from "@mui/material";

const LocationCard = () => {
  const buttonStyle = {
    color: "#f45b69",
    "&:hover": {
      backgroundColor: "#fff8f9",
    },
  };
  return (
    <Card sx={{ maxWidth: 345, height: 500 }}>
      <CardMedia
        component="img"
        alt="fithub-lication-img"
        height="260"
        image={require("../assets/women-fitness.jpg")}
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          FitHub1
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Address: Timisoara, Strada Ion Ionescu, Nr. 15
        </Typography>
      </CardContent>

      <CardActions>
        <Button size="small" sx={buttonStyle}>
          Show directions
        </Button>
        <Button size="small" sx={buttonStyle}>
          See schedule
        </Button>
      </CardActions>
      <Divider />

      <CardContent>
        <div className="bottom-card-container">
          <div className="bottom-card-column">
            <Typography variant="body2" color="text.secondary">
              Distance
            </Typography>
            <div>2 km</div>
          </div>
          <div className="bottom-card-column">
            <Typography variant="body2" color="text.secondary">
              Duration
            </Typography>
            <div>20 min</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;
