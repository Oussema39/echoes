import { RequestHandler } from "express";

const lastUserRequest: Record<string, number> = {};

export const rateLimiterMiddleware: RequestHandler = (req, res, next) => {
  const user = req.user;
  if (!user) return res.status(401).json({ message: "Unauthorized access" });

  const lastRequest = lastUserRequest[user.id];
  const now = Date.now();
  const differenceInSeconds = (now - lastRequest) / 1000;

  if (!lastRequest) {
    lastUserRequest[user.id] = now;
    return next();
  }

  if (differenceInSeconds < 10) {
    return res.status(429).json({
      message:
        "Too many requests. Please wait a few seconds before trying again.",
    });
  }

  lastUserRequest[user.id] = now;

  return next();
};
