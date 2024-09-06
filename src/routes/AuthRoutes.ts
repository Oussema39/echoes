import { Router } from "express";
import {
  loginUser,
  refreshAccessToken,
  registerUser,
} from "../controllers/AuthController";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.patch("/refreshToken", refreshAccessToken);

export default router;
