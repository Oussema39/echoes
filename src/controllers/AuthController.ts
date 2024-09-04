import jwt from "jsonwebtoken";
import { RequestHandler } from "express";
import UserModel from "../models/User";
import { IUser } from "../interface/IUser";
import { comparePassword } from "../helpers/bcrypt";
import { type Document } from "mongoose";

const JWT_SECRET = process.env.JWT_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const userData: Omit<IUser, keyof Document> = { ...req.body };

    const userExists = await UserModel.findOne({ email: userData.email });

    if (Boolean(userExists)) {
      return res.status(400).json({ message: "User with same email exists" });
    }

    const refreshToken = jwt.sign({ email: userData.email }, REFRESH_SECRET, {
      expiresIn: "7d",
    });

    const user = new UserModel({ ...userData, refreshToken });
    await user.save();

    const savedUser = await UserModel.findById<IUser>(user._id)
      .select("-password -__v")
      .lean();

    const accessToken = jwt.sign({ email: savedUser?.email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.cookie("refreshToken", refreshToken, {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered",
      data: { user: savedUser, accessToken },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const loginUser: RequestHandler = async (req, res) => {
  const {
    email,
    password,
  }: Pick<Omit<IUser, keyof Document>, "email" | "password"> = req.body;
  try {
    const { password: userPassword, ...user } =
      ((await UserModel.findOne({ email }).lean()) as IUser) ?? ({} as IUser);
    if (!Boolean(user)) {
      return res.status(400).json({ message: `Wrong email or password ` });
    }

    const passwordMatches = await comparePassword(password, userPassword);

    if (!passwordMatches) {
      return res.status(400).json({ message: `Wrong email or password ` });
    }

    const accessToken = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

    res
      .status(200)
      .json({ message: "User logged in", data: { user, accessToken } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const refreshAccessToken: RequestHandler = async (req, res) => {
  const refreshToken = req.cookies?.["refreshToken"];
  if (!refreshToken) {
    res.status(400).json({ message: "Invalid refresh token" });
  }

  // TODO:Complete the refresh token API
};
