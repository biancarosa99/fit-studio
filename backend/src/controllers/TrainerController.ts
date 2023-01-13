import express = require("express");
const router = express.Router();
import {
  createFitnessClass,
  getTrainerClasses,
  removeFitnessClass,
  getPastTrainerClasses,
} from "../services/TrainerService";
import { verifyToken } from "../middleware/verifyToken";

router.post("/trainer/create", verifyToken, createFitnessClass); // create a scheduled class
router.delete("/trainer/:id", verifyToken, removeFitnessClass); // remove a scheduled class
router.get("/trainer/future", verifyToken, getTrainerClasses); // get all the upcoming trainer's classes
router.get("/trainer/past", verifyToken, getPastTrainerClasses); // get all the past trainer's classes

module.exports = router;
