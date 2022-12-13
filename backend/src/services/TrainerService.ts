import { Request, Response } from "express";
import ScheduledClass from "../entities/ScheduledClass";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import { checkScheduledClassAvailability } from "../utils/helperFunctions";
import * as dayjs from "dayjs";
dayjs().format();
import isSameOrAfter = require("dayjs/plugin/isSameOrAfter");
dayjs.extend(isSameOrAfter);

export const createFitnessClass = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { date, remaining_spots, fitnessClassId, locationId } = req.body;
  const { tkUser } = req;
  console.log(tkUser);
  try {
    if (!tkUser.isTrainer) return res.status(401).json("Not a trainer");

    const [valid, errorMessage] = await checkScheduledClassAvailability(
      tkUser.id,
      locationId,
      fitnessClassId,
      date
    );
    if (!valid) return res.status(405).json(errorMessage);

    const scheduledClass = myDataSource.getRepository(ScheduledClass).create({
      date,
      remaining_spots,
      fitnessClass: {
        id: fitnessClassId,
      },
      location: {
        id: locationId,
      },
      trainer: {
        id: tkUser.id,
      },
    });
    const result = await scheduledClass.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const removeFitnessClass = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { scheduledClassId } = req.params;
  const { tkUser } = req;

  try {
    if (!tkUser.isTrainer) return res.status(401).json("Not a trainer");

    const scheduledClass = await myDataSource
      .getRepository(ScheduledClass)
      .findOne({
        where: {
          id: scheduledClassId,
        },
      });

    if (tkUser.id !== scheduledClass.trainer.id)
      return res
        .status(401)
        .json("You are not authorized to remove this scheduled class!");

    await myDataSource.getRepository(ScheduledClass).remove(scheduledClass);
    return res.json("Product deleted successfully");
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getTrainerClasses = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  try {
    const scheduledClasses = await myDataSource
      .getRepository(ScheduledClass)
      .find({
        where: {
          trainer: {
            id: tkUser.id,
          },
        },
        order: {
          date: "ASC",
        },
      });
    const now = dayjs();
    const result = scheduledClasses.filter((fitnessClass) =>
      dayjs(fitnessClass.date).isSameOrAfter(now)
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getPastTrainerClasses = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  try {
    const scheduledClasses = await myDataSource
      .getRepository(ScheduledClass)
      .find({
        where: {
          trainer: {
            id: tkUser.id,
          },
        },
        order: {
          date: "ASC",
        },
      });
    const now = dayjs();
    const result = scheduledClasses.filter((fitnessClass) =>
      dayjs(now).isSameOrAfter(fitnessClass.date)
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

module.exports = {
  createFitnessClass,
  removeFitnessClass,
  getTrainerClasses,
  getPastTrainerClasses,
};
