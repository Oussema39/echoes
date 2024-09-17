import { RequestHandler } from "express";
import UserModel from "../models/User";
import { IUser } from "../interface/IUser";
import { isValidObjectId } from "mongoose";

export const getUsers: RequestHandler = async (_req, res) => {
  try {
    const users =
      (await UserModel.find().select("-password -refreshToken")) ?? [];

    return res.status(200).json({ data: users });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error, Could not delete user" });
  }
};

export const addUser: RequestHandler = async (req, res) => {
  try {
    const userData = { ...req.body } as IUser;

    const userExists = await UserModel.findOne({ email: userData.email });

    if (Boolean(userExists)) {
      throw new Error("User with same email exists");
    }

    const user = new UserModel(userData);
    const savedUser = await user.save();
    res.status(201).json({ message: "User created", data: savedUser });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: "Could not save user, please try again" });
  }
};

export const updateUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ message: "Invalid User ID" });
    }

    const userData: Partial<Omit<IUser, "password" | "id" | "_id">> = {
      ...req.body,
    };

    const updatedUser = await UserModel.findByIdAndUpdate(userId, userData, {
      runValidators: true,
      new: true,
    });

    if (!updatedUser) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated", data: updatedUser });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: "Could not save user, please try again" });
  }
};

export const deleteUser: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!isValidObjectId(userId))
      return res.status(400).json({ message: "Invalid User ID" });

    const user = await UserModel.findByIdAndDelete(userId);

    return res.status(200).json({ userId, user });
  } catch (error: any) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Internal Server Error, Could not delete user" });
  }
};
