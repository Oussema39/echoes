import { RequestHandler } from "express";
import { IUser } from "../interface/IUser";

const lastUserRequest: Record<string, number> = {};
type TUserProps = Omit<IUser, keyof Document>;

export const rateLimiterMiddleware: RequestHandler = (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized access" });

  const lastRequest = lastUserRequest[user.email];
  const now = Date.now();
  const differenceInSeconds = (now - lastRequest) / 1000;

  if (!lastRequest) {
    lastUserRequest[user.email] = now;
    return next();
  }

  if (differenceInSeconds < 10) {
    return res.status(429).json({
      message:
        "Too many requests. Please wait a few seconds before trying again.",
    });
  }

  lastUserRequest[user.email] = now;

  return next();
};
