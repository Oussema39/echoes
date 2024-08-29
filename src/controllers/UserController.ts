import { RequestHandler } from "express";
import UserModel from "../models/User";
import { IUser } from "../interface/IUser";

export const addUser: RequestHandler = async (req, res) => {
  try {
    const userData = { ...req.body } as IUser;
    // const { error } = JoiUser.validate(userData);

    // if (error) throw new Error(error.message);

    const userExists = await UserModel.find({ email: userData.email });

    if (Boolean(userExists)) {
      throw new Error("User with same email exists");
    }

    const user = new UserModel(userData);
    const savedUser = await user.save();
    res.status(200).json(savedUser);
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: "Could not save user, please try again" });
  }
};
