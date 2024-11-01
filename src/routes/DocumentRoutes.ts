import { Router } from "express";
import {
  addDocument,
  deleteDocument,
  getDocuments,
  updateDocument,
} from "../controllers/DocumentController";

const router = Router();

router.get("/", getDocuments);
router.post("/", addDocument);
router.delete("/:id", deleteDocument);
router.patch("/:id", updateDocument);

export default router;
