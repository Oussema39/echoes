import { Router } from "express";
import { paraphrase } from "../controllers/AIController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

router.post("/paraphrase", isAuthenticated, paraphrase);

export default router;
