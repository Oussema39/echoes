import { RequestHandler } from "express";
import { JoiUser } from "../helpers/validators";
import UserModel from "../models/User";

export const addUser: RequestHandler = (req, res) => {
  try {
    const userData = { ...req.body };
    const { error } = JoiUser.validate(userData);

    if (error) throw new Error(error.message);

    const user = new UserModel(userData);
    user.save();
  } catch (error) {
    console.error(error);
    res.status(400).json("Could not save new user");
  }
};
