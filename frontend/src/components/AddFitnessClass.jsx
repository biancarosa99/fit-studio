import React, { forwardRef } from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
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

// import { useForm } from "react-hook-form";
// import { useYupValidationResolver } from "../validations/YupResolver";
// import { scheduleClassValidationSchema } from "../validations/ScheduleClassValidation";
// import { useEffect } from "react";

const AddFitnessClass = forwardRef((props, ref) => {
  const { user } = useContext(AuthContext);

  const [location, setLocation] = useState("");
  const [fitnessClass, setFitnessClass] = useState("");
  const [maxSpots, setMaxSpots] = useState("");
  const [date, setDate] = useState("");

  const [dbLocations, setDbLocations] = useState([]);
  const [dbFitnessClasses, setDbFitnessClasses] = useState([]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleFitnessClassChange = (event) => {
    setFitnessClass(event.target.value);
  };

  const scheduleClassHandler = async (e) => {
    e.preventDefault();

    try {
      const userTk = user.token;
      await axios.post(
        "/trainer/create",
        {
          date,
          remaining_spots: maxSpots,
          fitnessClassId: fitnessClass,
          locationId: location,
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

    console.log(
      "form subbmited: " +
        fitnessClass +
        " " +
        location +
        " " +
        maxSpots +
        " " +
        date
    );
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
    <LocalizationProvider dateAdapter={AdapterDateFns}>
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
              {dbLocations &&
                dbLocations.map((dbLocation, index) => (
                  <MenuItem key={index} value={dbLocation.id}>
                    {dbLocation.name}
                  </MenuItem>
                ))}
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
              {dbFitnessClasses &&
                dbFitnessClasses.map((dbFitnessClass, index) => (
                  <MenuItem key={index} value={dbFitnessClass.id}>
                    {dbFitnessClass.name}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <TextField
              lid="outlined-basic"
              type="number"
              label="Maximum Spots"
              variant="outlined"
              value={maxSpots}
              onChange={(e) => setMaxSpots(e.target.value)}
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
