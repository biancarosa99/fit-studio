import React, { useImperativeHandle, useState } from "react";
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
import { forwardRef } from "react";

const TrainerClasses = forwardRef((props, ref) => {
  const { user } = useContext(AuthContext);

  const [upcomingClassesVisible, setUpcomingClassesVisible] = useState();
  const [pastClassesVisible, setPastClassesVisible] = useState();
  const [isViewParticipantsModalOpen, setIsViewParticipantsModalOpen] =
    useState(false);
  const [fitnessClassId, setFitnessClassId] = useState();
  const [classes, setClasses] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(10);

  const { time } = useParams();

  const { classesTableRef, refreshClassesRef } = ref;

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
      console.log(res.data);
      setClasses(res.data.scheduledClasses);
      setTotalPages(Math.ceil(res.data.total / 5));
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangePage = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    getClasses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [time]);

  useImperativeHandle(refreshClassesRef, () => ({
    getClasses,
  }));

  return (
    <React.Fragment>
      <div className="trainer-table-actions-container" ref={classesTableRef}>
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
            count={totalPages}
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
});

export default TrainerClasses;
