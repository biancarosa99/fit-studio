import React from "react";
import "../styles/BuySubscriptionModal.css";
import Modal from "../UI/Modal";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CreditCardOutlinedIcon from "@mui/icons-material/CreditCardOutlined";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useState } from "react";
import SnackBar from "../UI/SnackBar";

const BuySubscriptionModal = (props) => {
  const { user } = useContext(AuthContext);
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false);
  const [snackbarErrorMessage, setSnackbarErrorMessage] = useState("");

  const dayjs = require("dayjs");
  const currentDate = dayjs().set("hour", 0).set("minute", 0).set("second", 0);
  const currentDateToSend = dayjs(currentDate)
    .set("hour", 0)
    .set("minute", 0)
    .set("second", 0);

  const subscriptionId = props.subscriptionId;
  const subscriptionName = props.subscriptionName;
  const subscriptionPricing = props.subscriptionPricing;
  const subscriptionDuration = props.subscriptionDuration;

  console.log(currentDate);

  const buySubscriptionHandler = async () => {
    try {
      if (user) {
        const userTk = user.token;
        await axios.post(
          "/user/buySubscription",
          {
            startDate: currentDateToSend,
            subscriptionId,
          },
          {
            headers: {
              Authorization: `Bearer ${userTk}`,
            },
          }
        );
        props.succsessfulBuySubscription();
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

  return (
    <React.Fragment>
      <Modal>
        <div className="modal-container">
          <div className="buy-title-section">
            <div className="buy-title">Buy subscription?</div>
            <button
              className="close-button"
              onClick={props.closeBuySubscription}
            >
              <CloseRoundedIcon />
            </button>
          </div>

          <div className="subscription-details-section">
            <div className="subscription-name">{subscriptionName}</div>

            <div className="subscription-location">
              <span className="icon">
                <LocationOnOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </span>
              <span> Access to all FitHub clubs</span>
            </div>

            <div className="subscription-availability">
              <span className="icon">
                <CalendarMonthOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </span>
              <span>
                Pass availability: {subscriptionDuration}{" "}
                {subscriptionDuration === 1 ? "month" : "months"}
              </span>
            </div>

            <div className="subscription-price">
              <span className="icon">
                <CreditCardOutlinedIcon
                  sx={{ color: "#f45b69", fontSize: "large" }}
                />
              </span>
              <span> Total amount to pay: {subscriptionPricing} lei</span>
            </div>
          </div>

          <div className="actions">
            <button className="action-button" onClick={buySubscriptionHandler}>
              Confirm
            </button>
            <button
              className="action-button"
              onClick={props.closeBuySubscription}
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

export default BuySubscriptionModal;
