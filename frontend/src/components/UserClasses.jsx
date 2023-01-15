import React, { useContext, useEffect } from "react";
import "../styles/UserClasses.css";
import Pagination from "@mui/material/Pagination";
import { useMediaQuery } from "react-responsive";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

// import { Fab } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import zIndex from "@mui/material/styles/zIndex";

const UserFutureClasses = (props) => {
  const { user } = useContext(AuthContext);
  const [upcomingClassesVisible, setUpcomingClassesVisible] = useState(true);
  const [pastClassesVisible, setPastClassesVisible] = useState(false);
  const [fitnessClassId, setFitnessClassId] = useState();
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { time } = useParams();

  const isMobile = useMediaQuery({ query: "(max-width: 548px)" });

  const paginationComponentSize = isMobile ? "small" : "large";

  const navigate = useNavigate();

  const dayjs = require("dayjs");

  let classesActionsClassName = upcomingClassesVisible
    ? "table-see-past-classes"
    : "table-see-future-classes";
  // const fabPinkStyle = {
  //   color: "common.white",
  //   bgcolor: "#f45b69",
  //   "&:hover": {
  //     bgcolor: "#f5717d",
  //   },
  //   zIndex: 0,
  // };

  const makePreviousClassesVisible = () => {
    setPage(1);
    navigate("/myplans/past");
    setUpcomingClassesVisible(false);
    setPastClassesVisible(true);
  };

  const makeFutureClassesVisible = () => {
    setPage(1);
    navigate("/myplans/future");
    setPastClassesVisible(false);
    setUpcomingClassesVisible(true);
  };

  const getFormattedDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY H:mm");
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  const getClasses = async () => {
    const userTk = user.token;
    try {
      const res = await axios.get(`/user/appointment/${time}`, {
        params: {
          take: 5,
          page: page,
        },

        headers: {
          Authorization: `Bearer ${userTk}`,
        },
      });
      console.log(res.data.scheduledAppointments);
      setClasses(res.data.scheduledAppointments);
      if (res.data.scheduledAppointments.length > 0) {
        setTotalPages(Math.ceil(res.data.total / 5));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log("time changed");
    getClasses();
  }, [time]);

  return (
    <React.Fragment>
      <div className="table-actions-container">
        <div className="table-title-container">
          <h3 className="table-title">
            {upcomingClassesVisible && "UPCOMING CLASSES"}
            {pastClassesVisible && "PREVIOUS CLASSES"}{" "}
          </h3>
        </div>
        <div className="table-see-classes">
          {upcomingClassesVisible && (
            <div className={classesActionsClassName}>
              <KeyboardArrowLeftIcon
                sx={{ cursor: "pointer" }}
                onClick={makePreviousClassesVisible}
              />
              <span
                className="table-classes"
                onClick={makePreviousClassesVisible}
              >
                {" "}
                PREVIOUS CLASSES
              </span>
            </div>
          )}

          {pastClassesVisible && (
            <div className={classesActionsClassName}>
              <span
                className="table-classes"
                onClick={makeFutureClassesVisible}
              >
                {" "}
                FUTURE CLASSES
              </span>
              <KeyboardArrowRightIcon
                sx={{ cursor: "pointer" }}
                onClick={makeFutureClassesVisible}
              />
            </div>
          )}
        </div>
      </div>

      <div className="table-container">
        <table className="user-classes-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Class</th>
              <th>Location</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes &&
              classes.map((appointment, index) => {
                const appointmentDate = getFormattedDate(appointment.date);

                return (
                  <tr key={index}>
                    <td data-label="Date" className="fitness-class-start-hour">
                      {appointmentDate}
                    </td>
                    <td data-label="Class">
                      {appointment.scheduledClass.fitnessClass.name}
                    </td>
                    <td data-label="Location">
                      {appointment.scheduledClass.location.name}
                    </td>
                    <td>
                      <button
                        className="cancel-class-button"
                        onClick={props.openCancelClassModal}
                      >
                        Cancel Class
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="pagination-container">
          <Pagination
            count={totalPages}
            page={page}
            size={paginationComponentSize}
            onChange={handleChangePage}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default UserFutureClasses;
