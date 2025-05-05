import { Router } from "express";
import {
  authWithGoogle,
  getCurrentUserData,
  googleAuthCallback,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/AuthController";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { rateLimiterMiddleware } from "../middlewares/rateLimiter";

const router = Router();

router.get("/me", isAuthenticated, getCurrentUserData);
router.get("/google", authWithGoogle);
router.get("/google/callback", googleAuthCallback);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", isAuthenticated, logoutUser);
router.all("/verifyEmail", verifyEmail);
router.post(
  "/sendVerificationEmail",
  isAuthenticated,
  rateLimiterMiddleware,
  sendVerificationEmail
);
router.patch("/refreshToken", refreshAccessToken);

export default router;
