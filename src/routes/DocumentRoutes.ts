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
import { isAuthenticated } from "../middlewares/authMiddleware";

const router = Router();

router.get("/by-user", isAuthenticated, getDocumentsByUser);
router.post("/share", isAuthenticated, shareDocument);
router.post("/generate-pdf", generateDocumentPdf);
router.delete("/:id", isAuthenticated, deleteDocument);
router.patch("/:id", isAuthenticated, updateDocument);
router.get("/:id/versions", isAuthenticated, getDocVersionsMetadataHandler);
router.get("/:id/versions/:versionId", isAuthenticated, getDocVersionDetails);
router.get("/", isAuthenticated, getDocuments);
router.post("/", isAuthenticated, addDocument);

export default router;
