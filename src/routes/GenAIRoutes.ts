import { Router } from "express";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { generateStream } from "../controllers/GenAIController";

const router = Router();

router.post("/stream", isAuthenticated, generateStream);

export default router;
