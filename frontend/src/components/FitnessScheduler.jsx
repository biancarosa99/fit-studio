import React, { useContext } from "react";
import "../styles/FitnessScheduler.css";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import LocationContext from "../context/LocationContext";

////useCallBack for getFitnessSchedule to incliude it in the dep array (acum nu e warning pt ca e diabled eslint)

const FitnessScheduler = (props) => {
  const { currentLocation, setCurrentLocation } = useContext(LocationContext);
  const [, setIsDropDownOpen] = useState(false);
  const [locations, setLocations] = useState([]);
  const [fitnessSchedule, setFitnessSchedule] = useState({});

  const dayjs = require("dayjs");
  const localizedFormat = require("dayjs/plugin/localizedFormat");

  dayjs.extend(localizedFormat);

  const getLocations = async () => {
    try {
      const res = await axios.get("/location/");
      setLocations(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getClassesForEachWeekDay = (schedule) => {
    let scheduleByDays = {};

    schedule.forEach((fitnessClass) => {
      const dayOfWeek = dayjs(fitnessClass.date).format("dddd");
      if (!scheduleByDays[dayOfWeek]) {
        scheduleByDays[dayOfWeek] = [];
      }
      scheduleByDays[dayOfWeek].push(fitnessClass);
    });

    return scheduleByDays;
  };

  const getFitnessSchedule = async () => {
    try {
      const res = await axios.get(`/schedule/${currentLocation.id}`);

      const schedule = res.data;
      console.log(res.data);

      if (schedule) {
        const scheduleByDaysArray = getClassesForEachWeekDay(schedule);
        setFitnessSchedule(scheduleByDaysArray);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLocations();
  }, []);

  useEffect(() => {
    getFitnessSchedule();
  }, [currentLocation]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDropDownArrowClick = () => {
    setIsDropDownOpen((prev) => !prev);
  };

  const getFormattedDate = (date) => {
    return dayjs(date).format("LLL");
  };

  return (
    <React.Fragment>
      <div className="heading">
        <h1 className="heading-title">{currentLocation.name}</h1>
        <div className="dropdown">
          <ArrowDropDownIcon
            sx={{
              color: "#f45b69",
              fontSize: 60,
              cursor: "pointer",
              marginTop: 1,
            }}
            onClick={handleDropDownArrowClick}
          />
          <div className="dropdown-content">
            {locations.map((location, index) => (
              <div
                className="location-option"
                key={index}
                onClick={() => setCurrentLocation(location)}
              >
                {location.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {Object.keys(fitnessSchedule).map((day, index) => (
        <div className="table-container" key={index}>
          <table className="table">
            <caption>{day}</caption>
            <tbody>
              {fitnessSchedule[day] &&
                fitnessSchedule[day].map((scheduledClass, index) => {
                  const className = scheduledClass.fitnessClass.name;
                  const classLocation = scheduledClass.location.name;
                  const classDate = getFormattedDate(scheduledClass.date);
                  const classId = scheduledClass.id;
                  const classMaxSpots = scheduledClass.max_spots;
                  const classDuration = scheduledClass.fitnessClass.duration;
                  return (
                    <tr key={index}>
                      <td
                        data-lable="Start Hour"
                        className="fitness-start-hour-cell"
                      >
                        {dayjs(scheduledClass.date).format("HH")}:
                        {dayjs(scheduledClass.date).format("mm")}
                      </td>
                      <td data-lable="Fitness Class Name">{className}</td>
                      <td data-lable="Avalable spots">{classDuration} mins</td>
                      <td data-lable="Actions">
                        <button
                          className="join-class-button"
                          onClick={() =>
                            props.openConfirmAppointment(
                              className,
                              classLocation,
                              classDate,
                              classId,
                              classMaxSpots
                            )
                          }
                        >
                          Show Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      ))}
    </React.Fragment>
  );
};

export default FitnessScheduler;
