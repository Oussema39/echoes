import { Router } from "express";
import { addDocument } from "../controllers/DocumentController";

const router = Router();

router.post("/", addDocument);

export default router;
