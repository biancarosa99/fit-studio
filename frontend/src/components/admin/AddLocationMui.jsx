import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import parse from "autosuggest-highlight/parse";
import { debounce } from "@mui/material/utils";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import "../../styles/AddLocation.css";
import { Button, FormControl } from "@mui/material";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useState } from "react";
import SnackBar from "../../UI/SnackBar";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_API_KEY;

function loadScript(src, position, id) {
  if (!position) {
    return;
  }

  const script = document.createElement("script");
  script.setAttribute("async", "");
  script.setAttribute("id", id);
  script.src = src;
  position.appendChild(script);
}

const autocompleteService = { current: null };

export default function GoogleMaps() {
  const { user } = useContext(AuthContext);
  const [value, setValue] = React.useState(null);
  const [inputValue, setInputValue] = React.useState("");
  const [options, setOptions] = React.useState([]);
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null,
  });
  const [locationName, setLocationName] = React.useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const loaded = React.useRef(false);

  if (typeof window !== "undefined" && !loaded.current) {
    if (!document.querySelector("#google-maps")) {
      loadScript(
        `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=Function.prototype`,
        document.querySelector("head"),
        "google-maps"
      );
    }

    loaded.current = true;
  }

  const fetch = React.useMemo(
    () =>
      debounce((request, callback) => {
        autocompleteService.current.getPlacePredictions(request, callback);
      }, 400),
    []
  );

  React.useEffect(() => {
    let active = true;

    if (!autocompleteService.current && window.google) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
    }
    if (!autocompleteService.current) {
      return undefined;
    }

    if (inputValue === "") {
      setOptions(value ? [value] : []);
      return undefined;
    }

    fetch({ input: inputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (value) {
          newOptions = [value];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [value, inputValue, fetch]);

  const getLocationCoordinates = async (value) => {
    const results = await geocodeByAddress(value);
    const latLng = await getLatLng(results[0]);
    console.log(latLng);
    setCoordinates(latLng);
  };

  const openSnackbar = (message, status) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(status);
    setIsSnackbarOpen(true);
    setTimeout(() => setIsSnackbarOpen(false), 6000);
  };

  const convertBase64 = (file) => {
    if (file) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
          resolve(fileReader.result);
        };

        fileReader.onerror = (error) => {
          reject(error);
        };
      });
    }
  };

  const handleChangeImage = (e) => {
    setImageUrl(e.target.files[0]);
    if (e.target.value) {
      setImageFileName(e.target.files[0].name);
    } else {
      setImageFileName(e.target.value);
    }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const userTk = user.token;
      const base64 = await convertBase64(imageUrl);
      await axios.post(
        "/admin/location",
        {
          name: locationName,
          address: value?.description,
          lat: coordinates?.lat,
          lng: coordinates?.lng,
          imageUrl: base64,
        },
        {
          headers: {
            Authorization: `Bearer ${userTk}`,
          },
        }
      );
      setLocationName("");
      setValue(null);
      setImageUrl("");
      setImageFileName("");
      setIsUploading(false);
      openSnackbar("Location added succesfully!", "success");
    } catch (err) {
      console.log(err);
      openSnackbar(err.response.data, "error");
    }
  };

  const locationInputSx = {
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69 !important",
    },
    label: {
      color: "#f45b69 !important",
    },
    "label.Mui-focused": {
      color: "#f45b69 !important",
    },
    "&:focus label": {
      color: "#f45b69",
    },
    ".MuiFormLabel-focus": {
      color: "#f45b69 ",
    },
  };

  return (
    <div className="add-location-container">
      {/* <div className="add-location-title-container">
        <h2 className="add-location-title">Add a new location</h2>
      </div> */}
      <form
        className="add-location-form-container"
        onSubmit={handleAddLocation}
      >
        <FormControl fullWidth>
          <TextField
            lid="location-name"
            type="text"
            label="Location Name"
            variant="outlined"
            sx={locationInputSx}
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            inputProps={{ maxLength: 25 }}
          />
        </FormControl>
        <Autocomplete
          id="google-map-demo"
          fullWidth
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option?.description
          }
          filterOptions={(x) => x}
          options={options}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={value}
          noOptionsText="No locations"
          onChange={(event, newValue) => {
            setOptions(newValue ? [newValue, ...options] : options);
            setValue(newValue);
            if (newValue) {
              getLocationCoordinates(newValue?.description);
            }
          }}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Location address"
              fullWidth
              sx={locationInputSx}
            ></TextField>
          )}
          renderOption={(props, option) => {
            const matches =
              option.structured_formatting.main_text_matched_substrings || [];

            const parts = parse(
              option.structured_formatting.main_text,
              matches.map((match) => [
                match.offset,
                match.offset + match.length,
              ])
            );

            return (
              <li {...props}>
                <Grid container alignItems="center">
                  <Grid item sx={{ display: "flex", width: 44 }}>
                    <LocationOnIcon sx={{ color: "text.secondary" }} />
                  </Grid>
                  <Grid
                    item
                    sx={{ width: "calc(100% - 44px)", wordWrap: "break-word" }}
                  >
                    {parts.map((part, index) => (
                      <Box
                        key={index}
                        component="span"
                        sx={{ fontWeight: part.highlight ? "bold" : "regular" }}
                      >
                        {part.text}
                      </Box>
                    ))}

                    <Typography variant="body2" color="text.secondary">
                      {option.structured_formatting.secondary_text}
                    </Typography>
                  </Grid>
                </Grid>
              </li>
            );
          }}
        />
        <div className="file-upload-container">
          {/* Upload File */}
          <div className="file-upload">
            <input
              accept="image/*"
              type="file"
              className="file-input"
              onChange={handleChangeImage}
            />
            <div className="upload-file-icon-container">
              <CloudUploadIcon fontSize="large" />
              <div>{imageFileName ? imageFileName : "Upload image"}</div>
            </div>
          </div>
        </div>
        <div className="add-location-button-container">
          {isUploading ? (
            <CircularProgress />
          ) : (
            <button className="add-location-button">Add location</button>
          )}
        </div>
      </form>

      <SnackBar
        open={isSnackbarOpen}
        closeSnackbarHandler={() => setIsSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </div>
  );
}
