import { Router } from "express";
import { addDocument, deleteDocument } from "../controllers/DocumentController";

const router = Router();

router.post("/", addDocument);
router.delete("/:id", deleteDocument);

export default router;
