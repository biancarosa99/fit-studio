import { Request, Response } from "express";
import Subscription from "../entities/Subscription";
import Location from "../entities/Location";
import FitnessClass from "../entities/FitnessClass";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";

export const createLocation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, address, lat, lng } = req.body;
  const { tkUser } = req;

  if (!tkUser.isAdmin)
    return res
      .status(401)
      .json("You are not authenticated to create a new location");

  if (!name) return res.status(400).json("Name cannot be empty");

  if (!address) return res.status(400).json("Address cannot be empty");

  if (!lat)
    return res.status(400).json("Please choose a location from the list");

  if (!lng)
    return res.status(400).json("Please choose a location from the list");

  try {
    const location = myDataSource.getRepository(Location).create({
      name,
      address,
      lat,
      lng,
    });
    const result = await location.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const createFitnessClass = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description, duration, level, imgURL } = req.body;
  const { tkUser } = req;

  console.log(tkUser);

  if (!tkUser.isAdmin)
    return res
      .status(401)
      .json("You are not authenticated to create a subscription");

  try {
    const fitnessClass = myDataSource.getRepository(FitnessClass).create({
      name,
      description,
      duration,
      level,
      imgURL,
    });
    const result = await fitnessClass.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const createSubscription = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, price, duration } = req.body;
  const { tkUser } = req;

  if (!tkUser.isAdmin)
    return res
      .status(401)
      .json("You are not authenticaded to create a subscription");
  try {
    const subscription = myDataSource.getRepository(Subscription).create({
      name,
      duration,
      price,
    });
    const result = await subscription.save();
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

module.exports = { createFitnessClass, createSubscription, createLocation };
