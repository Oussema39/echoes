import { Router } from "express";
import {
  addDocument,
  deleteDocument,
  getDocuments,
  getDocumentsByUser,
  shareDocument,
  updateDocument,
} from "../controllers/DocumentController";

const router = Router();

router.get("/by-user", getDocumentsByUser);
router.post("/share", shareDocument);
router.get("/", getDocuments);
router.post("/", addDocument);
router.delete("/:id", deleteDocument);
router.patch("/:id", updateDocument);

export default router;
