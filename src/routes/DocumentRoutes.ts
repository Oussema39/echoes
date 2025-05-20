import { Router } from "express";
import {
  addDocument,
  deleteDocument,
  generateDocumentPdf,
  getDocuments,
  getDocumentsByUser,
  getDocVersionDetails,
  getDocVersionsMetadataHandler,
  shareDocument,
  updateDocument,
} from "../controllers/DocumentController";

const router = Router();

router.get("/by-user", getDocumentsByUser);
router.post("/share", shareDocument);
router.post("/generate-pdf", generateDocumentPdf);
router.delete("/:id", () => {}, deleteDocument);
router.patch("/:id", updateDocument);
router.get("/:id/versions", getDocVersionsMetadataHandler);
router.get("/:id/versions/:versionId", getDocVersionDetails);
router.get("/", getDocuments);
router.post("/", addDocument);

export default router;
