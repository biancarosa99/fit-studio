import express = require("express");
const router = express.Router();
import {
  buySubscription,
  getUser,
  getUserAppointments,
  getPastUserAppointments,
  makeAppointment,
  removeAppointment,
  getActiveSubscription,
} from "../services/UserService";
import { verifyToken } from "../middleware/verifyToken";

router.get("/user/", verifyToken, getUser); // get user
router.post("/user/appointment", verifyToken, makeAppointment); // make an appointment to a scheduled class
router.post("/user/buySubscription", verifyToken, buySubscription); // user buy a subscription
router.delete(
  "/user/appointment/:appointmentId",
  verifyToken,
  removeAppointment
); // remove an appointment to a scheduled class
router.get("/user/appointment/future", verifyToken, getUserAppointments); // get all the upcoming scheduled appointments for a user
router.get("/user/appointment/past", verifyToken, getPastUserAppointments); // get all the past appointments for a user
router.get("/user/subscription/", verifyToken, getActiveSubscription); // get active subscription for a user

module.exports = router;
