import { Router } from "express";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/AuthController";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.all("/verifyEmail", verifyEmail);
router.post(
  "/sendVerificationEmail",
  isAuthenticated,
  rateLimiterMiddleware,
  sendVerificationEmail
);
router.patch("/refreshToken", refreshAccessToken);

export default router;
