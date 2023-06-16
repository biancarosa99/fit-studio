import React, { useState } from "react";
import "../styles/CancelAppointmentModal.css";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import Modal from "../UI/Modal";
import axios from "axios";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import SnackBar from "../UI/SnackBar";

const CancelAppointmentModal = (props) => {
  const { user } = useContext(AuthContext);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("");
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);

  const appointmentId = props.appointmentId;
  const appointmentDate = props.appointmentDate;
  const scheduledClassName = props.scheduledClassName;
  const scheduledClassLocation = props.scheduledClassLocation;

  const cancelClassHandler = async () => {
    const userTk = user.token;
    try {
      if (appointmentId && userTk) {
        await axios.delete(`/user/appointment/${appointmentId}`, {
          headers: {
            Authorization: `Bearer ${userTk}`,
          },
        });
        props.succsessfulCancelApointment();
      } else {
        setSnackbarErrorMessage("Something went wrong!");
        openErrorSnackbarHandler();
      }
    } catch (err) {
      setSnackbarErrorMessage(err.response.data);
      openErrorSnackbarHandler();
    }
  };

  const openErrorSnackbarHandler = () => {
    setOpenErrorSnackbar(true);
    setTimeout(() => setOpenErrorSnackbar(false), 6000);
  };

  const closeSnackbarHandler = () => {
    setOpenErrorSnackbar(false);
  };

  return (
    <React.Fragment>
      {" "}
      <Modal>
        <div className="modal-container">
          <div className="confirm-title-section">
            <div className="confirm-title">
              Are you sure you want to cancel the class?
            </div>
            <button
              className="close-button"
              onClick={props.closeCancelClassModal}
            >
              <CloseRoundedIcon />
            </button>
          </div>

          <div className="class-details-section">
            <div className="class-name">{scheduledClassName}</div>
            <div className="class-location">
              <span className="icon">
                <LocationOnOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </span>
              <span>{scheduledClassLocation}</span>
            </div>
            <div className="class-date">
              <span className="icon">
                <CalendarMonthOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </span>
              <span>{appointmentDate}</span>
            </div>
          </div>

          <div className="actions">
            <button className="action-button" onClick={cancelClassHandler}>
              Confirm
            </button>
            <button
              className="action-button"
              onClick={props.closeCancelClassModal}
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

export default CancelAppointmentModal;
