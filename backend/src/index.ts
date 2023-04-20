const express = require("express");
import cors = require("cors");
import { myDataSource } from "./app-data-source";
import * as dotenv from "dotenv";
dotenv.config();
const app = express();
const bodyParser = require("body-parser");

import authRoutes = require("./controllers/AuthController");
import userRoutes = require("./controllers/UserController");
import trainerRoutes = require("./controllers/TrainerController");
import adminRoutes = require("./controllers/AdminController");
import scheduledClassRoutes = require("./controllers/ScheduledClassController");
import subscriptionRoutes = require("./controllers/SubscriptionController");
import locationRoutes = require("./controllers/LocationController");
import fitnessClassRoutes = require("./controllers/FitnessClassController");

myDataSource
  .initialize()
  .then(() => {
    app.use(cors({ origin: "*", optionSuccessStatus: 200 }));

    app.use(bodyParser.json({ limit: "50mb" }));
    app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    app.use(express.json());

    app.use(authRoutes);
    app.use(userRoutes);
    app.use(trainerRoutes);
    app.use(adminRoutes);
    app.use(scheduledClassRoutes);
    app.use(subscriptionRoutes);
    app.use(locationRoutes);
    app.use(fitnessClassRoutes);

    app.listen(3000, function () {
      console.log(`Backend server running on port ${3000}`);
    });
  })
  .catch((e) => {
    console.log(e);
  });
