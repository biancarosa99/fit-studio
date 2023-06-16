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
import { FormControl } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { useState } from "react";
import SnackBar from "../../UI/SnackBar";
import { convertBase64 } from "../../utils/utils";

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

const autocompleteService = { current: null };

export default function AddLocation() {
  const { user } = useContext(AuthContext);

  const [locationName, setLocationName] = React.useState("");
  const [locationAddress, setLocationAddress] = React.useState(null);
  const [addressInputValue, setAddressInputValue] = React.useState("");
  const [addressOptions, setAddressOptions] = React.useState([]);
  const [coordinates, setCoordinates] = React.useState({
    lat: null,
    lng: null,
  });
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

  const fetchAddressOptions = React.useMemo(
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

    if (addressInputValue === "") {
      setAddressOptions(locationAddress ? [locationAddress] : []);
      return undefined;
    }
    fetchAddressOptions({ input: addressInputValue }, (results) => {
      if (active) {
        let newOptions = [];

        if (locationAddress) {
          newOptions = [locationAddress];
        }

        if (results) {
          newOptions = [...newOptions, ...results];
        }

        setAddressOptions(newOptions);
      }
    });

    return () => {
      active = false;
    };
  }, [locationAddress, addressInputValue, fetchAddressOptions]);

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

  const handleChangeImage = async (e) => {
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
      const convertedImage = await convertBase64(imageUrl);
      await axios.post(
        "/admin/location",
        {
          name: locationName,
          address: locationAddress?.description,
          lat: coordinates?.lat,
          lng: coordinates?.lng,
          imageUrl: convertedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${userTk}`,
          },
        }
      );
      setLocationName("");
      setLocationAddress(null);
      setImageUrl("");
      setImageFileName("");
      setIsUploading(false);
      openSnackbar("Location added succesfully!", "success");
    } catch (err) {
      setIsUploading(false);
      openSnackbar(err.response.data, "error");
    }
  };

  return (
    <div className="add-location-container">
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
          id="google-map-autocomplete"
          fullWidth
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option?.description
          }
          filterOptions={(x) => x}
          options={addressOptions}
          autoComplete
          includeInputInList
          filterSelectedOptions
          value={locationAddress}
          noOptionsText="No locations"
          onChange={(event, newValue) => {
            setAddressOptions(
              newValue ? [newValue, ...addressOptions] : addressOptions
            );
            setLocationAddress(newValue);
            if (newValue) {
              getLocationCoordinates(newValue?.description);
            }
          }}
          onInputChange={(event, newInputValue) => {
            setAddressInputValue(newInputValue);
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
