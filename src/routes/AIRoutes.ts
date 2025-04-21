import { Router } from "express";
import { correct, paraphrase, shorten } from "../controllers/AIController";
import { isAuthenticated } from "../middlewares/authMiddleware";
import { generateStream, initStream } from "../controllers/GenAIController";

const router = Router();

router.post("/paraphrase", isAuthenticated, paraphrase);
router.post("/shorten", isAuthenticated, shorten);
router.post("/correct", isAuthenticated, correct);
router.post("/initStream", isAuthenticated, initStream);
router.get("/stream", generateStream);

export default router;
