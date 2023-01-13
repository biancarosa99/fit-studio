import React, { useState } from "react";
import "../styles/TrainerClasses.css";
import Pagination from "@mui/material/Pagination";
import { useMediaQuery } from "react-responsive";
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { useContext } from "react";
import ViewParticipantsList from "./ViewParticipantsList";

const TrainerClasses = (props) => {
  const { user } = useContext(AuthContext);

  const [upcomingClassesVisible, setUpcomingClassesVisible] = useState();
  const [pastClassesVisible, setPastClassesVisible] = useState();
  const [isViewParticipantsModalOpen, setIsViewParticipantsModalOpen] =
    useState(false);
  const [fitnessClassId, setFitnessClassId] = useState();
  const [classes, setClasses] = useState(false);
  const [page, setPage] = useState(1);

  const { time } = useParams();

  const dayjs = require("dayjs");

  const isMobile = useMediaQuery({ query: "(max-width: 548px)" });

  const navigate = useNavigate();

  const paginationComponentSize = isMobile ? "small" : "large";

  let classesActionsClassName = upcomingClassesVisible
    ? "trainer-table-see-past-classes"
    : "trainer-table-see-future-classes";

  const fabPinkStyle = {
    color: "common.white",
    bgcolor: "#f45b69",
    "&:hover": {
      bgcolor: "#f5717d",
    },
    zIndex: 0,
  };

  const getFormattedDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY H:mm");
  };

  const makePreviousClassesVisible = () => {
    setUpcomingClassesVisible(false);
    setPastClassesVisible(true);
    setPage(1);
    navigate("/trainerclasses/past");
  };

  const makeFutureClassesVisible = () => {
    setPastClassesVisible(false);
    setUpcomingClassesVisible(true);
    setPage(1);
    navigate("/trainerclasses/future");
  };

  const openViewParticipantsList = (fitnessClassId) => {
    setIsViewParticipantsModalOpen(true);
    setFitnessClassId(fitnessClassId);
  };

  const getClasses = async () => {
    const userTk = user.token;
    console.log(page);
    try {
      const res = await axios.get(`/trainer/${time}`, {
        params: {
          take: 5,
          page,
        },

        headers: {
          Authorization: `Bearer ${userTk}`,
        },
      });
      setClasses(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    getClasses();
  }, [page]);

  useEffect(() => {
    if (time === "past") {
      setUpcomingClassesVisible(false);
      setPastClassesVisible(true);
    } else {
      setPastClassesVisible(false);
      setUpcomingClassesVisible(true);
    }
    getClasses();
  }, [time]);

  return (
    <React.Fragment>
      <div className="trainer-table-actions-container">
        <div className="table-title-container">
          <h3 className="table-title">
            {upcomingClassesVisible && "UPCOMING CLASSES"}
            {pastClassesVisible && "PREVIOUS CLASSES"}
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
      <div className="trainer-future-classes-table-container">
        <table className="trainer-classes-table">
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
              classes.map((scheduledClass, index) => {
                const classDate = getFormattedDate(scheduledClass.date);

                return (
                  <tr key={index}>
                    <td data-label="Date" className="fitness-class-start-hour">
                      {classDate}
                    </td>
                    <td data-label="Class">
                      {scheduledClass.fitnessClass.name}
                    </td>
                    <td data-label="Location">
                      {scheduledClass.location.name}
                    </td>
                    <td>
                      <button
                        className="view-participants-button"
                        onClick={() =>
                          openViewParticipantsList(scheduledClass.id)
                        }
                      >
                        View Particiants
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
        <div className="pagination-container">
          <Pagination
            count={10}
            page={page}
            size={paginationComponentSize}
            onChange={handleChangePage}
          />
        </div>
        <div className="add-fitness-class-container">
          <Fab
            sx={fabPinkStyle}
            aria-label="add"
            onClick={props.toggleAddClass}
          >
            <AddIcon />
          </Fab>
        </div>
      </div>
      {isViewParticipantsModalOpen && (
        <ViewParticipantsList
          closeViewParticipantsList={() =>
            setIsViewParticipantsModalOpen(false)
          }
          scheduledClassId={fitnessClassId}
          tkUser={user.token}
        />
      )}
    </React.Fragment>
  );
};

export default TrainerClasses;
