import React, { useState } from "react";
import "../styles/UserSubscription.css";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import AuthContext from "../context/AuthContext";
import { useEffect } from "react";
import axios from "axios";
import { useContext } from "react";

const UserSubscription = () => {
  const { user } = useContext(AuthContext);
  const [activeSubscription, setActiveSubscription] = useState({});

  const dayjs = require("dayjs");

  const getFormattedDate = (date) => {
    return dayjs(date).format("DD/MM/YYYY");
  };

  useEffect(() => {
    const tkUser = user.token;
    const getActiveSubscription = async () => {
      try {
        const res = await axios.get("/user/subscription/", {
          headers: {
            Authorization: `Bearer ${tkUser}`,
          },
        });
        setActiveSubscription(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getActiveSubscription();
  }, [user.token]);
  return (
    <div className="user-subscription-container">
      <h3>ACTIVE SUBSCRIPTION</h3>

      {Object.keys(activeSubscription).length > 0 ? (
        <div className="user-subscription">
          <h3>{activeSubscription.subscription.name}</h3>

          <div className="price">
            <span>{activeSubscription.subscription.price} lei</span>
          </div>

          <h3 className="month">
            {activeSubscription.subscription.duration} month
          </h3>

          <div className="subscription-details">
            <div className="subscription-detail">
              <PersonOutlineIcon sx={{ color: "#f45b69" }} />
              <div className="subscription-detail-row-name">User: </div>
              <div>
                {activeSubscription.user.firstname}{" "}
                {activeSubscription.user.lastname}
              </div>
            </div>

            <div className="subscription-detail">
              <CalendarMonthOutlinedIcon
                sx={{ color: "#f45b69", fontSize: "large" }}
              />
              <div className="subscription-detail-row-name">Start Date: </div>
              <div>{getFormattedDate(activeSubscription.start_date)}</div>
            </div>

            <div className="subscription-detail">
              <CalendarMonthOutlinedIcon
                sx={{ color: "#f45b69", fontSize: "large" }}
              />
              <div className="subscription-detail-row-name">End Date: </div>
              <div>{getFormattedDate(activeSubscription.end_date)}</div>
            </div>

            <div className="subscription-detail">
              <LocationOnOutlinedIcon
                sx={{ color: "#f45b69", fontSize: "large" }}
              />
              <div className="subscription-detail-row-name">Locations: </div>
              <div>All FitHub Studios</div>
            </div>
          </div>
        </div>
      ) : (
        <div className="no-active-subscription">
          <h4>No active subscription found</h4>
        </div>
      )}
    </div>
  );
};

export default UserSubscription;
