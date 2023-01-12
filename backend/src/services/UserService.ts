import { Request, Response } from "express";
import User from "../entities/User";
import Appointment from "../entities/Appointment";
import FitnessClass from "../entities/FitnessClass";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import ScheduledClass from "../entities/ScheduledClass";
import UserSubscription from "../entities/UserSubscription";
import Subscription from "../entities/Subscription";
import {
  isSubscriptionValid,
  checkSubscriptionDuplicates,
} from "../utils/helperFunctions";
import * as dayjs from "dayjs";
dayjs().format();
import duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
import isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);

export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const { tkUser } = req;
  try {
    const user = await myDataSource.getRepository(User).findOne({
      where: {
        id: tkUser.id,
      },
    });
    return res.json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const makeAppointment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { scheduledClassId }: { scheduledClassId: string } = req.body;

  const [valid, message] = await isSubscriptionValid(
    tkUser.id,
    scheduledClassId
  );
  if (!valid) return res.status(403).json(message);

  const [appointments, appointments_count] = await myDataSource
    .getRepository(Appointment)
    .findAndCount({
      where: {
        scheduledClass: {
          id: scheduledClassId,
        },
      },
    });

  const already_appointed = appointments.find(
    (appointment) => appointment.user.id === tkUser.id
  );
  if (already_appointed)
    return res
      .status(405)
      .json("You are already appointed to this fitness class!");

  const scheduledClass = await myDataSource
    .getRepository(ScheduledClass)
    .findOne({
      where: {
        id: scheduledClassId,
      },
    });

  if (appointments_count >= scheduledClass.max_spots)
    return res
      .status(405)
      .json("Maximum number of people reached for this fitness class!");

  try {
    const appointment = myDataSource.getRepository(Appointment).create({
      user: {
        id: tkUser.id,
      },
      scheduledClass: {
        id: scheduledClassId,
      },
    });

    const result = await appointment.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const removeAppointment = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { appointmentId } = req.params;
  const { tkUser } = req;
  try {
    const appointment = await myDataSource
      .getRepository(Appointment)
      .findOneOrFail({
        where: {
          id: appointmentId,
        },
      });

    if (tkUser.id !== appointment.user.id)
      return res
        .status(401)
        .json("You are not authorized to remove this appointment!");

    await myDataSource.getRepository(Appointment).remove(appointment);
    return res.json(appointment);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

//start date o sa fie data din front ca fiind ora la care se cumpara subscriptionu.
export const buySubscription = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { start_date, subscriptionId } = req.body;

  const valid = await checkSubscriptionDuplicates(tkUser.id, start_date);
  if (!valid)
    return res
      .status(403)
      .json("User already has a subscription that is overlaping this period!");

  const subscriptionType = await myDataSource
    .getRepository(Subscription)
    .findOne({
      where: {
        id: subscriptionId,
      },
    });

  try {
    const start = dayjs(start_date);
    const end = start.add(subscriptionType.duration, "months");

    const userSubscription = myDataSource
      .getRepository(UserSubscription)
      .create({
        start_date: start,
        end_date: end,
        user: {
          id: tkUser.id,
        },
        subscription: {
          id: subscriptionId,
        },
      });
    const result = await userSubscription.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const getUserAppointments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { take, page } = req.query;
  try {
    const scheduledAppointments = await myDataSource
      .getRepository(Appointment)
      .find({
        where: {
          user: {
            id: tkUser.id,
          },
        },
        order: {
          scheduledClass: {
            date: "DESC",
          },
        },
        take: +take,
        skip: (+page - 1) * +take,
      });
    const now = dayjs();
    const result = scheduledAppointments
      .reverse()
      .filter((appointment) =>
        dayjs(appointment.scheduledClass.date).isSameOrAfter(now)
      );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getPastUserAppointments = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  const { take, page } = req.query;
  try {
    const scheduledAppointments = await myDataSource
      .getRepository(Appointment)
      .find({
        where: {
          user: {
            id: tkUser.id,
          },
        },
        order: {
          scheduledClass: {
            date: "ASC",
          },
        },
        take: +take,
        skip: (+page - 1) * +take,
      });
    const now = dayjs();
    const result = scheduledAppointments.filter((appointment) =>
      dayjs(now).isSameOrAfter(appointment.scheduledClass.date)
    );
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

export const getActiveSubscription = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { tkUser } = req;
  try {
    const activeSubscription = await myDataSource
      .getRepository(UserSubscription)
      .find({
        where: {
          user: {
            id: tkUser.id,
          },
        },
        order: {
          start_date: "DESC",
        },
      });

    if (
      dayjs().isBetween(
        activeSubscription[0].start_date,
        activeSubscription[0].end_date
      )
    )
      return res.status(200).json(activeSubscription[0]);
    else return res.status(404).json("Did not find any active subscriptions");
  } catch (error) {
    console.log(error);
    return res.status(400).json("Something went wrong!");
  }
};

module.exports = {
  getUser,
  makeAppointment,
  removeAppointment,
  buySubscription,
  getUserAppointments,
  getPastUserAppointments,
  getActiveSubscription,
};
