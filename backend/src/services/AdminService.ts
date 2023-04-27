import { Response } from "express";
import Subscription from "../entities/Subscription";
import Location from "../entities/Location";
import FitnessClass from "../entities/FitnessClass";
import { myDataSource } from "../app-data-source";
import { AuthenticatedRequest } from "../middleware/verifyToken";
import User from "../entities/User";

const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const opts = {
  overwrite: true,
  invalidate: true,
  resource_type: "auto",
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  const { tkUser } = req;

  if (!tkUser.isAdmin)
    return res.status(401).json("You are not authorized to see all users");

  try {
    const users = await myDataSource.getRepository(User).find({
      order: {
        lastname: "ASC",
      },
    });
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const editUserRole = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { userId, isAdmin, isTrainer } = req.body;
  try {
    const userRepository = myDataSource.getRepository(User);
    const userToUpdate = await userRepository.findOneBy({
      id: userId,
    });

    userToUpdate.isAdmin = isAdmin;
    userToUpdate.isTrainer = isTrainer;
    const updatedUser = await userRepository.save(userToUpdate);
    return res.status(200).json(updatedUser);
  } catch (error) {
    return res.status(500).json(error);
  }
};

export const createLocation = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, address, lat, lng, imageUrl } = req.body;
  const { tkUser } = req;

  if (!tkUser.isAdmin)
    return res
      .status(401)
      .json("You are not authorized to create a new location");

  if (!name) return res.status(400).json("Name cannot be empty");

  if (!address) return res.status(400).json("Address cannot be empty");

  if (!lat)
    return res.status(400).json("Please choose a location from the list");

  if (!lng)
    return res.status(400).json("Please choose a location from the list");

  if (!imageUrl) return res.status(400).json("Please upload an image");

  const latitude = Number(lat);
  const longitude = Number(lng);
  try {
    const uploadedImage = await cloudinary.uploader.upload(imageUrl, opts);
    if (uploadedImage && uploadedImage.secure_url) {
      const location = myDataSource.getRepository(Location).create({
        name,
        address,
        lat: latitude,
        lng: longitude,
        imageUrl: uploadedImage.secure_url,
      });
      const result = await location.save();
      return res.json(result);
    } else {
      return res.status(500).json("Could not upload image to Cloudinary");
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json(error);
  }
};

export const createFitnessClass = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  const { name, description, duration, level, imgUrl } = req.body;
  const { tkUser } = req;

  console.log(tkUser);

  if (!tkUser.isAdmin)
    return res
      .status(401)
      .json("You are not authenticated to create a fitness class");

  if (!name) return res.status(400).json("Name cannot be empty");

  if (!description) return res.status(400).json("Description cannot be empty");

  if (!duration) return res.status(400).json("Class duration cannot be empty");

  if (!level) return res.status(400).json("Level cannot be empty");

  if (!imgUrl) return res.status(400).json("Please upload an image");

  try {
    const uploadedImage = await cloudinary.uploader.upload(imgUrl, opts);
    if (uploadedImage && uploadedImage.secure_url) {
      const fitnessClass = myDataSource.getRepository(FitnessClass).create({
        name,
        description,
        duration,
        level,
      });
      const result = await fitnessClass.save();
      return res.json(result);
    } else {
      return res.status(500).json("Could not upload image to Cloudinary");
    }
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

module.exports = {
  getAllUsers,
  editUserRole,
  createFitnessClass,
  createSubscription,
  createLocation,
};
