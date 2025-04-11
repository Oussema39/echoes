import { Router } from "express";
import { correct, paraphrase, shorten } from "../controllers/AIController";
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

router.post("/paraphrase", isAuthenticated, paraphrase);
router.post("/shorten", isAuthenticated, shorten);
router.post("/correct", isAuthenticated, correct);

export default router;
