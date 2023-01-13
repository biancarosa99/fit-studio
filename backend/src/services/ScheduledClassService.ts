import { Request, Response, Router } from "express";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import ScheduledClass from "../entities/ScheduledClass";
import * as dayjs from "dayjs";
dayjs().format();
import duration = require("dayjs/plugin/duration");
import weekday = require("dayjs/plugin/weekday");
import isBetween = require("dayjs/plugin/isBetween");
import Appointment from "../entities/Appointment";
import FitnessClass from "../entities/FitnessClass";
dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(weekday);

export const getCurrentWeekSchedule = async (req: Request, res: Response) => {
  const { locationId } = req.params;
  try {
    const scheduledClasses = await myDataSource
      .getRepository(ScheduledClass)
      .find({
        where: {
          location: {
            id: locationId,
          },
        },
        order: {
          date: "ASC",
        },
      });
    const result = scheduledClasses.filter((fitnessClass) =>
      dayjs(fitnessClass.date).isBetween(
        dayjs().weekday(1),
        dayjs().weekday(7),
        "day",
        "[]"
      )
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getScheduledClassUsers = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { scheduledClassId } = req.params;
  try {
    const scheduledClass = await myDataSource
      .getRepository(ScheduledClass)
      .findOne({
        where: {
          id: scheduledClassId,
        },
      });
    if (tkUser.id !== scheduledClass.trainer.id)
      return res
        .status(403)
        .json(
          "You are not authorized to view this trainer's scheduled class users"
        );

    const appointments = await myDataSource.getRepository(Appointment).find({
      where: {
        scheduledClass: {
          id: scheduledClassId,
        },
      },
    });
    const users = appointments.map((appointment) => appointment.user);
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getScheduledClassSpots = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { scheduledClassId } = req.params;
  try {
    const [appointments, total] = await myDataSource
      .getRepository(Appointment)
      .findAndCount({
        where: {
          scheduledClass: {
            id: scheduledClassId,
          },
        },
      });
    return res.status(200).json(total);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getScheduledClassInfo = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { scheduledClassId } = req.params;
  console.log(tkUser);
  try {
    const scheduledClass = await myDataSource
      .getRepository(ScheduledClass)
      .findOne({
        where: {
          id: scheduledClassId,
        },
      });
    console.log(
      "tkuser id :" + tkUser.id + " trainer id :" + scheduledClass.trainer.id
    );
    if (tkUser.id !== scheduledClass.trainer.id)
      return res
        .status(403)
        .json(
          "You are not authorized to view this trainer's scheduled class informations"
        );
    return res.status(200).json(scheduledClass);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

module.exports = {
  getCurrentWeekSchedule,
  getScheduledClassUsers,
  getScheduledClassSpots,
  getScheduledClassInfo,
};
