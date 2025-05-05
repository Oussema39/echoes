import { RequestHandler } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  const accessToken =
    req.headers.authorization?.split(" ")?.[1] ?? req.cookies.auth_token;

  if (!accessToken) {
    return res.status(401).json({ message: "Missing authorization token" });
  }

  try {
    const decoded = jwt.verify(accessToken!, JWT_SECRET);
    (req as any).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized access" });
  }
};
