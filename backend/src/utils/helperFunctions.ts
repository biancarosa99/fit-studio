import UserSubscription from "../entities/UserSubscription";
import { myDataSource } from "../app-data-source";
import ScheduledClass from "../entities/ScheduledClass";
import FitnessClass from "../entities/FitnessClass";
import * as dayjs from "dayjs";
dayjs().format();
import isBetween = require("dayjs/plugin/isBetween");
dayjs.extend(isBetween);
import duration = require("dayjs/plugin/duration");
dayjs.extend(duration);
import isSameOrAfter = require("dayjs/plugin/isSameOrAfter");

dayjs.extend(isSameOrAfter);

export const isSubscriptionValid = async (userId, scheduledClassId) => {
  try {
    const subscriptions = await myDataSource
      .getRepository(UserSubscription)
      .find({
        where: {
          user: {
            id: userId,
          },
        },
      });

    const scheduledClass = await myDataSource
      .getRepository(ScheduledClass)
      .findOne({
        where: {
          id: scheduledClassId,
        },
      });

    const now = dayjs();
    const validSubscription = subscriptions.find(
      (subscription) =>
        dayjs(now).isBetween(
          subscription.start_date,
          subscription.end_date,
          "day",
          "[]"
        ) &&
        dayjs(scheduledClass.date).isBetween(
          subscription.start_date,
          subscription.end_date,
          "day",
          "[]"
        ) === true
    );

    if (!validSubscription) return [false, "Subscritpion is not valid!"];
    else return [true, "success"];
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const checkSubscriptionDuplicates = async (userId, start_date) => {
  try {
    const subscriptions = await myDataSource
      .getRepository(UserSubscription)
      .find({
        where: {
          user: {
            id: userId,
          },
        },
      });

    const valid = subscriptions.find(
      (subscription) =>
        dayjs(start_date).isBetween(
          subscription.start_date,
          subscription.end_date,
          "day",
          "[]"
        ) === true
    );

    if (valid) return false;
    else return true;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const isScheduledClassValid = async (
  trainerId,
  locationId,
  fitnessClassId,
  start_date
) => {
  try {
    const trainerClasses = await myDataSource
      .getRepository(ScheduledClass)
      .find({
        where: {
          trainer: {
            id: trainerId,
          },
        },
      });

    const locationClasses = await myDataSource
      .getRepository(ScheduledClass)
      .find({
        where: {
          location: {
            id: locationId,
          },
        },
      });

    const fitnessClass = await myDataSource
      .getRepository(FitnessClass)
      .findOne({
        where: {
          id: fitnessClassId,
        },
      });

    const start = dayjs(start_date);
    const end = start.add(fitnessClass.duration, "minutes");

    const validTrainerHour = trainerClasses.find(
      (fitnessClass) =>
        dayjs(fitnessClass.date).isBetween(start, end, "minutes", "[]") === true
    );

    if (validTrainerHour)
      return [
        false,
        "The trainer already has a scheduled class in this period!",
      ];

    const validLocation = locationClasses.find(
      (fitnessClass) =>
        dayjs(fitnessClass.date).isBetween(start, end, "minutes", "[]") === true
    );

    if (validLocation)
      return [
        false,
        "A fitness class is already scheduled for this location at the selected hour",
      ];

    const validClassDate = dayjs().isSameOrAfter(start_date);
    if (validClassDate)
      return [false, "You can't appoint a fitness class in the past"];

    return [true, "success"];
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports = {
  isSubscriptionValid,
  checkSubscriptionDuplicates,
  isScheduledClassValid,
};
