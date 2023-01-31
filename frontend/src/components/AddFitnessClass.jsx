import React, { forwardRef } from "react";
import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import "../styles/AddFitnessClass.css";
import axios from "axios";
import { useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { Controller, useForm } from "react-hook-form";
import { useYupValidationResolver } from "../validations/YupResolver";
import { scheduleClassValidationSchema } from "../validations/ScheduleClassValidation";

const AddFitnessClass = forwardRef((props, ref) => {
  const { user } = useContext(AuthContext);

  const [dbLocations, setDbLocations] = useState([]);
  const [dbFitnessClasses, setDbFitnessClasses] = useState([]);

  const resolver = useYupValidationResolver(scheduleClassValidationSchema);

  const {
    register,
    handleSubmit,
    control,

    formState: { errors },
  } = useForm({
    resolver,
    defaultValues: { date: "" },
  });

  const scheduleClassHandler = async (data) => {
    try {
      const userTk = user.token;
      await axios.post(
        "/trainer/create",
        {
          date: data.date,
          remaining_spots: data.maxSpots,
          fitnessClassId: data.fitnessClass,
          locationId: data.location,
        },
        {
          headers: {
            Authorization: `Bearer ${userTk}`,
          },
        }
      );
      props.successfulScheduleNewClassHandler();
    } catch (err) {
      props.unsuccessfulScheduleNewClassHandler(err.response.data);
    }
  };

  useEffect(() => {
    const getLocations = async () => {
      try {
        const res = await axios.get("/location/");
        setDbLocations(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const getFitnessClasses = async () => {
      try {
        const res = await axios.get("/fitnessClass/");
        setDbFitnessClasses(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    getLocations();
    getFitnessClasses();
  }, []);

  const locationSx = {
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69",
    },
    ".MuiSvgIcon-root ": {
      fill: "#f45b69 !important",
    },
    "label.Mui-focused": {
      color: "#f45b69 !important",
    },
    "&:focus label": {
      color: "#f45b69",
    },
    ".MuiFormLabel-focus": {
      color: "#f45b69",
    },
  };

  const classSx = {
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69",
    },
    ".MuiSvgIcon-root ": {
      fill: "#f45b69 !important",
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

  const maxSpotsSx = {
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

  const datePickerSx = {
    ".myDatePicker .Mui-focused fieldset.MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69 !important",
    },
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#f45b69",
    },
    ".MuiSvgIcon-root ": {
      fill: "#f45b69 !important",
    },
    "label.Mui-focused": {
      color: "#f45b69 !important",
    },
    "&:focus label": {
      color: "#f45b69 !important",
    },
    ".MuiFormLabel-focus": {
      color: "#f45b69 !important",
    },
    ".MuiFormLabel-root": {
      color: "#f45b69 !important",
    },
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div className="add-class-container" ref={ref}>
        <div className="add-class-title-container">
          <h2 className="add-class-title">Schedule a new class</h2>
        </div>
        <form
          className="form-container"
          onSubmit={handleSubmit(scheduleClassHandler)}
        >
          <FormControl fullWidth error={!!errors.location}>
            <InputLabel
              id="location-select-label"
              sx={{
                color: "#f45b69 !important",
              }}
            >
              Location
            </InputLabel>
            <Select
              labelId="location-select-label"
              id="location-select"
              {...register("location")}
              defaultValue=""
              label="Location"
              MenuProps={{
                sx: {
                  "&& .Mui-selected": {
                    backgroundColor: "pink !important",
                  },
                },
              }}
              labelstyle={{ color: "#f45b69" }}
              sx={locationSx}
            >
              {dbLocations &&
                dbLocations.map((dbLocation, index) => (
                  <MenuItem key={index} value={dbLocation.id}>
                    {dbLocation.name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>{errors.location?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.fitnessClass}>
            <InputLabel
              id="class-select-label"
              sx={{
                color: "#f45b69 !important",
              }}
            >
              Class
            </InputLabel>
            <Select
              labelId="class-select-label"
              id="class-select"
              variant="outlined"
              label="Class"
              {...register("fitnessClass")}
              defaultValue=""
              MenuProps={{
                sx: {
                  "&& .Mui-selected": {
                    backgroundColor: "pink !important",
                  },
                },
              }}
              labelstyle={{ color: "#f45b69" }}
              sx={classSx}
            >
              {dbFitnessClasses &&
                dbFitnessClasses.map((dbFitnessClass, index) => (
                  <MenuItem key={index} value={dbFitnessClass.id}>
                    {dbFitnessClass.name}
                  </MenuItem>
                ))}
            </Select>
            <FormHelperText>{errors.fitnessClass?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth error={!!errors.maxSpots}>
            <TextField
              lid="outlined-basic"
              type="number"
              label="Maximum Spots"
              variant="outlined"
              {...register("maxSpots")}
              InputProps={{ inputProps: { min: 1, max: 50 } }}
              sx={maxSpotsSx}
            />
            <FormHelperText>{errors.maxSpots?.message}</FormHelperText>
          </FormControl>

          <FormControl fullWidth>
            <Controller
              name="date"
              control={control}
              render={({ field: { onChange, value }, fieldState }) => (
                <DateTimePicker
                  renderInput={(props) => (
                    <TextField
                      {...props}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      className="myDatePicker"
                      sx={datePickerSx}
                    />
                  )}
                  label="DateTimePicker"
                  value={value}
                  onChange={onChange}
                />
              )}
            ></Controller>
          </FormControl>
          <div className="add-class-button-container">
            <button className="add-class-button">Schedule class</button>
          </div>
        </form>
      </div>
    </LocalizationProvider>
  );
});

export default AddFitnessClass;
