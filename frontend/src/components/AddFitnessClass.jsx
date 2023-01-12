import React, { forwardRef } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import "../styles/AddFitnessClass.css";
// import { useForm } from "react-hook-form";
// import { useYupValidationResolver } from "../validations/YupResolver";
// import { scheduleClassValidationSchema } from "../validations/ScheduleClassValidation";
// import { useEffect } from "react";

const AddFitnessClass = forwardRef((props, ref) => {
  const [location, setLocation] = useState("");
  const [fitnessClass, setFitnessClass] = useState("");
  const [date, setDate] = useState("");

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleFitnessClassChange = (event) => {
    setFitnessClass(event.target.value);
  };

  const scheduleClassHandler = (e) => {
    e.preventDefault();
    setLocation("");
    setFitnessClass("");
    setDate("");
    props.sucsessfullScheduleNewClass();
    console.log("form subbmited");
    console.log(date);
  };

  // const resolver = useYupValidationResolver(scheduleClassValidationSchema);

  // const {
  //   register,
  //   handleSubmit,
  //   setValue,
  //   watch,
  //   formState: { errors },
  // } = useForm({
  //   resolver,
  // });

  // const selectLocationValue = watch("selectLocation");

  // const selectFitnessClassValue = watch("selectFitnessClass");

  // const setFitnessClassDateValue = watch("setFitnessClassDate");

  // useEffect(() => {
  //   register("selectLocation");
  //   register("selectFitnessClass");
  //   register("setFitnessClassDate");
  // }, [register]);

  // const handleLocationChange = (e) =>
  //   setValue("selectLocation", e.target.value);

  // const handleFitnessClassChange = (e) => {
  //   setValue("selectFitnessClass", e.target.value);
  // };

  // const handleFitnessClassDateChange = (e) => {
  //   setValue("setFitnessClassDate", e.target.value);
  // };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="add-class-container" ref={ref}>
        <div className="add-class-title-container">
          <h2 className="add-class-title">Schedule a new class</h2>
        </div>
        <form className="form-container" onSubmit={scheduleClassHandler}>
          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                color: "#f45b69 !important",
              }}
            >
              Location
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={location}
              // value={selectLocationValue}
              label="Location"
              onChange={handleLocationChange}
              MenuProps={{
                sx: {
                  "&& .Mui-selected": {
                    backgroundColor: "pink !important",
                  },
                },
              }}
              labelstyle={{ color: "#f45b69" }}
              sx={{
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
              }}
            >
              <MenuItem value={"FitHub1"}>FitHub 1</MenuItem>
              <MenuItem value={"FitHub2"}>FitHub 2</MenuItem>
              <MenuItem value={"FitHub3"}>FitHub 3</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel
              id="demo-simple-select-label"
              sx={{
                color: "#f45b69 !important",
              }}
            >
              Class
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              variant="outlined"
              id="demo-simple-select"
              // value={selectFitnessClassValue}
              value={fitnessClass}
              label="Class"
              onChange={handleFitnessClassChange}
              MenuProps={{
                sx: {
                  "&& .Mui-selected": {
                    backgroundColor: "pink !important",
                  },
                },
              }}
              labelstyle={{ color: "#f45b69" }}
              sx={{
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
              }}
            >
              <MenuItem value={"Kangoo Jumps"}>Kangoo Jumps</MenuItem>
              <MenuItem value={"Tabata Fitness"}>Tabata Fitness</MenuItem>
              <MenuItem value={"Fitbalance"}>Fitbalance</MenuItem>
              <MenuItem value={"Legs&Butt"}>Legs&butt</MenuItem>
              <MenuItem value={"Cycling"}>Cycling</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              lid="outlined-basic"
              type="number"
              label="Maximum Spots"
              variant="outlined"
              InputProps={{ inputProps: { min: 1, max: 50 } }}
              sx={{
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
              }}
            />
          </FormControl>

          <FormControl fullWidth>
            <DateTimePicker
              renderInput={(props) => (
                <TextField
                  {...props}
                  className="myDatePicker"
                  sx={{
                    ".myDatePicker .Mui-focused fieldset.MuiOutlinedInput-notchedOutline":
                      {
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
                  }}
                />
              )}
              label="DateTimePicker"
              value={date}
              onChange={(newValue) => {
                setDate(newValue);
              }}
            ></DateTimePicker>
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
