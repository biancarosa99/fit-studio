import * as React from "react";
import "../styles/LocationCard.css";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Divider } from "@mui/material";
import { useContext } from "react";
import LocationContext from "../context/LocationContext";
import TravelModeButtons from "./TravelModeButtons";

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

  const distanceToShow = currentDirections?.name === location?.name && distance;
  const durationToShow = currentDirections?.name === location?.name && duration;
  const showActiveButton = currentDirections?.name === location?.name;

  return (
    <Card sx={{ maxWidth: 645, height: 480 }}>
      {location?.imageUrl ? (
        <CardMedia
          component="img"
          alt="fithub-lication-img"
          height="210"
          image={location.imageUrl}
        />
      ) : (
        <CardMedia
          component="img"
          alt="fithub-lication-img"
          height="210"
          image={require("../assets/women-fitness.jpg")}
        />
      )}

      <CardContent sx={{ maxHeight: "14%" }}>
        <Typography gutterBottom variant="h5" component="div">
          {location?.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Address: {location?.address}
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

      <Divider />

      <CardContent>
        <TravelModeButtons showActiveButton={showActiveButton} />
      </CardContent>
    </Card>
  );
};

export default LocationCard;
