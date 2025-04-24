import { Router } from "express";
import {
  addDocument,
  deleteDocument,
  generateDocumentPdf,
  getDocuments,
  getDocumentsByUser,
  shareDocument,
  updateDocument,
} from "../controllers/DocumentController";

const router = Router();

router.get("/by-user", getDocumentsByUser);
router.post("/share", shareDocument);
router.post("/generate-pdf", generateDocumentPdf);
router.get("/", getDocuments);
router.post("/", addDocument);
router.delete("/:id", deleteDocument);
router.patch("/:id", updateDocument);

export default router;
