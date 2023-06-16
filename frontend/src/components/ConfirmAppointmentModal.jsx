import React, { useContext, useEffect } from "react";
import "../styles/ConfirmAppointmentModal.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SportsGymnasticsOutlinedIcon from "@mui/icons-material/SportsGymnasticsOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import Modal from "../UI/Modal";
import { useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import SnackBar from "../UI/SnackBar";

const ConfirmAppointmentModal = (props) => {
  const { user } = useContext(AuthContext);

  const [occupiedSpots, setOccupiedSpots] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("");

  const className = props.className;
  const classLocation = props.classLocation;
  const classDate = props.classDate;
  const classId = props.classId;
  const classMaxSpots = props.classMaxSpots;
  const classDificultyLevel = props.classDifficulty;
  const trainerName = props.trainerName;

  const getNumberOfClassOccupiedSpots = async () => {
    try {
      const res = await axios.get(`/schedule/spots/${classId}`);
      const numberOfOccupiedSpots = res.data;
      setOccupiedSpots(numberOfOccupiedSpots);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getNumberOfClassOccupiedSpots();
  });

  const handleMakeAppointment = async () => {
    try {
      const userTk = user.token;
      if (classId && user) {
        await axios.post(
          "/user/appointment",
          { scheduledClassId: classId },
          {
            headers: {
              Authorization: `Bearer ${userTk}`,
            },
          }
        );
        props.succsessfulApointment();
      } else {
        openErrorSnackbarHandler();
        setSnackbarErrorMessage("Something went wrong");
      }
    } catch (err) {
      openErrorSnackbarHandler();
      setSnackbarErrorMessage(err.response.data);
    }
  };

  const openErrorSnackbarHandler = () => {
    setOpenErrorSnackbar(true);
    setTimeout(() => setOpenErrorSnackbar(false), 6000);
  };

  const closeSnackbarHandler = () => {
    setOpenErrorSnackbar(false);
  };

  const classNotFull = classMaxSpots === occupiedSpots ? false : true;

  return (
    <React.Fragment>
      <Modal>
        <div className="modal-container">
          <div className="confirm-title-section">
            {classNotFull ? (
              <div className="confirm-title">Confirm Apppointment?</div>
            ) : (
              <div className="confirm-title full-class-title">
                This class is full
              </div>
            )}
            <button
              className="close-button"
              onClick={props.closeConfirmAppointment}
            >
              <CloseRoundedIcon />
            </button>
          </div>

          <div className="confirm-class-details-section">
            <div className="confirm-class-name">{className}</div>
            <div className="confirm-class-location">
              <div className="icon">
                <LocationOnOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </div>
              <div className="text">{classLocation}</div>
            </div>

            <div className="confirm-class-date">
              <div className="icon date-icon">
                <CalendarMonthOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </div>
              <div className="text"> {classDate}</div>
            </div>

            <div className="confirm-class-date">
              <div className="icon date-icon">
                <SportsGymnasticsOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </div>
              <div className="text"> {trainerName}</div>
            </div>

            <div className="confirm-class-date">
              <div className="icon date-icon">
                <FitnessCenterOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </div>
              <div className="text"> {classDificultyLevel}</div>
            </div>

            <div className="confirm-class-date">
              <div className="icon date-icon">
                <PeopleAltOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </div>
              <div className="text">
                {occupiedSpots}/{classMaxSpots} occupied spots
              </div>
            </div>
          </div>

          <div className="actions">
            {classNotFull && (
              <button
                className="actions-button"
                onClick={handleMakeAppointment}
              >
                Confirm
              </button>
            )}
            <button
              className="actions-button"
              onClick={props.closeConfirmAppointment}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>

      <SnackBar
        open={openErrorSnackbar}
        message={snackbarErrorMessage}
        closeSnackbarHandler={closeSnackbarHandler}
        severity="error"
      />
    </React.Fragment>
  );
};

export default ConfirmAppointmentModal;
