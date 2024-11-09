import { Router } from "express";
import {
  addDocument,
  deleteDocument,
  getDocuments,
  getDocumentsByUser,
  updateDocument,
} from "../controllers/DocumentController";

const router = Router();

router.get("/", getDocuments);
router.post("/", addDocument);
router.delete("/:id", deleteDocument);
router.patch("/:id", updateDocument);

router.get("/by-user", getDocumentsByUser);

export default router;
