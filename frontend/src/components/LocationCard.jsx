import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "../styles/LocationCard.css";
import { Divider } from "@mui/material";
import { useContext } from "react";
import LocationContext from "../context/LocationContext";

const LocationCard = ({ location }) => {
  const {
    distance,
    duration,
    currentDirections,
    setCurrentLocation,
    setCurrentDirections,
  } = useContext(LocationContext);
  const buttonStyle = {
    color: "#f45b69",
    "&:hover": {
      backgroundColor: "#fff8f9",
    },
  };

  const distanceToShow = currentDirections?.name === location.name && distance;
  const durationToShow = currentDirections?.name === location.name && duration;

  return (
    <Card sx={{ maxWidth: 645, height: 480 }}>
      <CardMedia
        component="img"
        alt="fithub-lication-img"
        height="260"
        image={require("../assets/women-fitness.jpg")}
      />

      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {location.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Address: {location.address}
        </Typography>
      </CardContent>

      <CardActions>
        <Button
          size="small"
          sx={buttonStyle}
          onClick={() => setCurrentDirections(location)}
        >
          Show directions
        </Button>
        <Button
          size="small"
          sx={buttonStyle}
          onClick={() => setCurrentLocation(location)}
        >
          <a href="/classesTimetable" style={{ color: "#f45b69" }}>
            See schedule
          </a>
        </Button>
      </CardActions>
      <Divider />

      <CardContent>
        <div className="bottom-card-container">
          <div className="bottom-card-column">
            <Typography variant="body2" color="text.secondary">
              Distance
            </Typography>
            <div>{distanceToShow ? distanceToShow : "-"}</div>
          </div>
          <div className="bottom-card-column">
            <Typography variant="body2" color="text.secondary">
              Duration
            </Typography>
            <div>{durationToShow ? durationToShow : "-"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationCard;