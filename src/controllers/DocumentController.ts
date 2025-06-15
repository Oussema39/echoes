import { RequestHandler } from "express";
import Joi from "joi";
import DocumentModel from "../models/Document";
import { formatValidationError, joiCustomObjectId } from "../helpers/errors";
import { TDocProps } from "../types/TDocProps";
import {
  createDocVersion,
  getDocVersionById,
  getDocVersionsMetadata,
} from "./DocChangeLogController";
import { IDocument } from "../interface/IDocument";
import mongoose from "mongoose";
import { joiCollaborators } from "../helpers/joiCustomTypes";
import { hasPermission } from "../helpers/utilMethods";
import { existsSync, readFileSync } from "fs";
import { join } from "path";
import { documentHtmlTemplate } from "../constants/templates";
import { BASE_PERMISSIONS } from "../constants/permissions";
import { buildBrowser } from "../config/puppeteerBrowser";
import { Browser } from "puppeteer-core";

export const getDocuments: RequestHandler = async (req, res) => {
  try {
    const documents = await DocumentModel.find()
      .sort({ updatedAt: -1 }) // Order by updatedAt descending
      .populate("owner", "-password -refreshToken")
      .lean();

    res.status(200).json({ data: documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDocumentsByUser: RequestHandler = async (req, res) => {
  const userId = mongoose.Types.ObjectId.createFromHexString(req?.user?.id!);

  try {
    const result = await DocumentModel.aggregate([
      {
        $lookup: {
          from: "docchangelogs",
          localField: "_id",
          foreignField: "documentId",
          as: "versions",
        },
      },
      {
        $set: {
          versions: {
            $sortArray: {
              input: "$versions",
              sortBy: { timestamp: -1 },
            },
          },
        },
      },
      {
        $facet: {
          owned: [{ $match: { owner: userId } }],
          sharedWithMe: [
            {
              $match: {
                collaborators: {
                  $elemMatch: {
                    userId: userId,
                  },
                },
              },
            },
          ],
        },
      },
    ]);

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const addDocument: RequestHandler = async (req, res) => {
  const bodySchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().optional(),
    // owner: joiCustomObjectId().required(),
    collaborators: joiCollaborators,
  });

  const { error } = bodySchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      details: error.details.map((err) => ({
        field: err.context?.key,
        message: err.message,
      })),
    });
  }

  const { title, content, collaborators } = req.body;
  const { id: owner } = req.user ?? {};

  try {
    const newDocument = new DocumentModel({
      title,
      content,
      owner,
      collaborators,
    });

    const rawDocument = await newDocument.save();
    const savedDocument = await DocumentModel.findOne({
      _id: rawDocument._id,
    })
      .populate("owner")
      .lean();

    res.status(200).json({ message: "Document added", data: savedDocument });
  } catch (error) {
    console.error("Error adding document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDocument: RequestHandler = async (req, res) => {
  const bodySchema = Joi.object({
    id: joiCustomObjectId().required(),
  });

  const { error } = bodySchema.validate(req.params);

  if (error) {
    const resBody = formatValidationError(error);
    return res.status(400).json(resBody);
  }

  try {
    const { id } = req.params;
    const doc = await DocumentModel.findById(id);

    if (!doc)
      return res.status(400).json({ message: "Document doesn't exist" });

    if (!hasPermission(BASE_PERMISSIONS.DELETE, req.user?.id!, doc)) {
      return res.status(401).json({ message: "Unauthorized action" });
    }

    const removedDoc = await DocumentModel.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ message: "Document deleted", data: removedDoc });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDocument: RequestHandler = async (req, res) => {
  const reqDataSchema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().optional(),
    content: Joi.string().optional().allow(""),
    collaborators: joiCollaborators,
  });

  const reqData = { ...req.body, ...req.params };

  const { error } = reqDataSchema.validate(reqData);

  if (error) {
    const resBody = formatValidationError(error);
    return res.status(400).json(resBody);
  }

  try {
    const {
      id,
      ...updates
    }: Partial<Omit<TDocProps, "owner">> & { id: string } = reqData;

    const oldDoc = (await DocumentModel.findOne({ _id: id })) as IDocument;

    if (!oldDoc) {
      return res.status(400).json({ message: "Document not found" });
    }

    if (!hasPermission(BASE_PERMISSIONS.WRITE, req.user?.id!, oldDoc)) {
      return res.status(401).json({ message: "Unauthorized action" });
    }

    const updatedDoc = await DocumentModel.findByIdAndUpdate(id, updates, {
      runValidators: true,
      new: true,
    }).populate("owner", "-password -refreshToken");

    //** Create a version of the document
    await createDocVersion({
      newDoc: updatedDoc!,
      oldDoc,
      changedBy: req?.user?.id!,
    });

    res.status(200).json({ message: "Document updated", data: updatedDoc });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const shareDocument: RequestHandler = async (req, res) => {
  const schema = Joi.object({
    docId: joiCustomObjectId().required(),
    collaborators: joiCollaborators.required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(formatValidationError(error));
  }

  const { docId, collaborators } = req.body;
  const { id: userId } = req.user ?? {};

  try {
    const document = await DocumentModel.findById(docId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (!hasPermission("share", userId!, document)) {
      return res
        .status(403)
        .json({ message: "Unauthorized to share this document" });
    }

    document.collaborators = collaborators; // Update collaborators array
    await document.save();

    res
      .status(200)
      .json({ message: "Document shared successfully", data: document });
  } catch (error) {
    console.error("Error sharing document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const generateDocumentPdf: RequestHandler = async (req, res) => {
  const schema = Joi.object({
    html: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json(formatValidationError(error));
  }

  let browser: Browser | null = null;

  try {
    const { html } = req.body;
    const cssPath = join(
      process.cwd(),
      "public",
      "assets",
      "quillSnowStyles.css"
    );

    if (!existsSync(cssPath)) {
      console.error("Quill CSS file not found at:", cssPath);
      throw new Error("Quill CSS file not found");
    }

    const quillCSS = readFileSync(cssPath, "utf-8");
    const content = documentHtmlTemplate({
      body: html,
      styles: quillCSS,
    });

    browser = await buildBrowser();
    const page = await browser.newPage();
    await page.setContent(content);
    const pdfBuffer = await page.pdf({ format: "A4", printBackground: true });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="document.pdf"');
    res.send(Buffer.from(pdfBuffer));
  } catch (error) {
    console.error("Error generating PDF:", error);
    res.status(500).json({ message: "Error generating PDF" });
  } finally {
    browser?.close();
  }
};

export const getDocVersionsMetadataHandler: RequestHandler = async (
  req,
  res
) => {
  const schema = Joi.object<{ id: string }>({
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.params);

  if (error) {
    res.status(403).json({ message: formatValidationError(error) });
  }

  try {
    const versions = await getDocVersionsMetadata(value.id);
    res.status(200).json({ versions });
  } catch (error) {
    console.error("Error fetching Doc Versions:", error);
    res.status(500).json({ message: "Error fetching Doc Versions" });
  }
};

export const getDocVersionDetails: RequestHandler = async (req, res) => {
  const schema = Joi.object<{ id: string; versionId: string }>({
    versionId: Joi.string().required(),
    id: Joi.string().required(),
  });
  const { error, value } = schema.validate(req.params);

  if (error) {
    res.status(403).json({ message: formatValidationError(error) });
  }

  try {
    const versionDetails = await getDocVersionById(value.versionId);
    res.status(200).json({ versionDetails });
  } catch (error) {
    console.error("Error fetching Version Details:", error);
    res.status(500).json({ message: "Error fetching Version Details" });
  }
};
