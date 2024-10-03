import { Router } from "express";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
  sendVerificationEmail,
  verifyEmail,
} from "../controllers/AuthController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.all("/verifyEmail", verifyEmail);
router.post("/sendVerificationEmail", sendVerificationEmail);
router.patch("/refreshToken", refreshAccessToken);

export default router;
