import { Router } from "express";
import { correct, paraphrase, shorten } from "../controllers/AIController";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { generateStream } from "../controllers/GenAIController";

const router = Router();

router.post("/paraphrase", isAuthenticated, paraphrase);
router.post("/shorten", isAuthenticated, shorten);
router.post("/correct", isAuthenticated, correct);
router.post("/stream", isAuthenticated, generateStream);

export default router;
