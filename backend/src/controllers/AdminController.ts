import express = require("express");
import { verifyToken } from "../middleware/verifyToken";
const router = express.Router();

import {
  createFitnessClass,
  createLocation,
  createSubscription,
  editUserRole,
  getAllUsers,
} from "../services/AdminService";

router.get("/admin/users", verifyToken, getAllUsers); //get users list
router.put("/admin/user", verifyToken, editUserRole); //
router.post("/admin/location", verifyToken, createLocation); // create a location
router.post("/admin/subscription", verifyToken, createSubscription); // create a subscription
router.post("/admin/fitnessClass", verifyToken, createFitnessClass); // create a fitness class

module.exports = router;
