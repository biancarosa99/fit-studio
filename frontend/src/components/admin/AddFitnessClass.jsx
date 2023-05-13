import React, { useContext, useState } from "react";
import "../../styles/AddFitnessClass.css";
import {
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { fitnessClassLevels } from "../../assets/fitnessClassData";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AuthContext from "../../context/AuthContext";
import axios from "axios";
import { convertBase64 } from "../../utils/utils";
import SnackBar from "../../UI/SnackBar";

const classTextInputSx = {
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

const AddFitnessClass = () => {
  const { user } = useContext(AuthContext);
  const [fitnessClassName, setFitnessClassName] = useState("");
  const [fitnessClassDesc, setFitnessClassDesc] = useState("");
  const [duration, setDuartion] = useState("");
  const [level, setLevel] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("");

  const classLevels = fitnessClassLevels;

  const handleChangeImage = (e) => {
    setImageUrl(e.target.files[0]);
    if (e.target.value) {
      setImageFileName(e.target.files[0].name);
    } else {
      setImageFileName(e.target.value);
    }
  };

  const openSnackbar = (message, status) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(status);
    setIsSnackbarOpen(true);
    setTimeout(() => setIsSnackbarOpen(false), 6000);
  };

  const handleAddFitnessClass = async (e) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      const userTk = user.token;
      const convertedImage = await convertBase64(imageUrl);

      await axios.post(
        "/admin/fitnessClass",
        {
          name: fitnessClassName,
          description: fitnessClassDesc,
          duration,
          level,
          imgUrl: convertedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${userTk}`,
          },
        }
      );
      setFitnessClassName("");
      setFitnessClassDesc("");
      setDuartion("");
      setLevel("");
      setImageUrl("");
      setImageFileName("");
      setIsUploading("");
      openSnackbar("Fitness Class added succesfully!", "success");
    } catch (err) {
      setIsUploading(false);
      openSnackbar(err.response.data, "error");
    }
  };

  return (
    <React.Fragment>
      <div className="add-fitness-class-container">
        <form
          className="add-fitness-class-form-container"
          onSubmit={handleAddFitnessClass}
        >
          <FormControl fullWidth>
            <TextField
              lid="outlined-basic"
              type="text"
              label="Class Name"
              variant="outlined"
              sx={classTextInputSx}
              value={fitnessClassName}
              onChange={(e) => setFitnessClassName(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              lid="outlined-basic"
              type="text"
              label="Class Description"
              sx={classTextInputSx}
              variant="outlined"
              value={fitnessClassDesc}
              onChange={(e) => setFitnessClassDesc(e.target.value)}
            />
          </FormControl>
          <FormControl fullWidth>
            <TextField
              lid="outlined-basic"
              type="number"
              label="Duration"
              variant="outlined"
              multiline
              maxRows={4}
              InputProps={{ inputProps: { min: 1, max: 120 } }}
              sx={classTextInputSx}
              value={duration}
              onChange={(e) => setDuartion(e.target.value)}
            />
          </FormControl>

          <FormControl fullWidth>
            <InputLabel
              id="fitness-class-select-label"
              sx={{
                color: "#f45b69 !important",
              }}
            >
              Level
            </InputLabel>
            <Select
              labelId="fitness-class-select-label"
              id="fitness-class-select"
              variant="outlined"
              label="Level"
              defaultValue=""
              MenuProps={{
                sx: {
                  "&& .Mui-selected": {
                    backgroundColor: "pink !important",
                  },
                },
              }}
              labelstyle={{ color: "#f45b69" }}
              sx={classTextInputSx}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              {classLevels &&
                classLevels.map((classLevel, index) => (
                  <MenuItem key={index} value={classLevel}>
                    {classLevel}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
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
              <button className="add-location-button">Add fitness class</button>
            )}
          </div>
        </form>
      </div>

      <SnackBar
        open={isSnackbarOpen}
        closeSnackbarHandler={() => setIsSnackbarOpen(false)}
        message={snackbarMessage}
        severity={snackbarSeverity}
      />
    </React.Fragment>
  );
};

export default AddFitnessClass;
