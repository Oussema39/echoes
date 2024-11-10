import { RequestHandler } from "express";
import Joi from "joi";
import DocumentModel from "../models/Document";
import { formatValidationError, joiCustomObjectId } from "../helpers/errors";
import { TDocProps } from "../types/TDocProps";
import { createDocVersion } from "./DocChangeLogController";
import { IDocument } from "../interface/IDocument";
import mongoose from "mongoose";

export const getDocuments: RequestHandler = async (req, res) => {
  try {
    const documents = await DocumentModel.find()
      .populate("owner", "-password -refreshToken")
      .lean();

    res.status(200).json({ data: documents });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const addDocument: RequestHandler = async (req, res) => {
  const bodySchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    // owner: joiCustomObjectId().required(),
    collaborators: Joi.array().items(Joi.string().required()).optional(),
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

  const { title, content } = req.body;
  const { id: owner } = (req as any).user ?? {};

  try {
    const newDocument = new DocumentModel({
      title,
      content,
      owner,
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
    const removedDoc = await DocumentModel.findByIdAndDelete(id);
    if (!removedDoc)
      return res.status(400).json({ message: "Document doesn't exist" });
    return res
      .status(200)
      .json({ message: "Document deleted", data: { removedDoc, docId: id } });
  } catch (error) {
    console.error("Error deleting document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateDocument: RequestHandler = async (req, res) => {
  const reqDataSchema = Joi.object({
    id: Joi.string().required(),
    title: Joi.string().optional(),
    content: Joi.string().optional(),
    collaborators: Joi.array().items(joiCustomObjectId().required()).optional(),
  });

  const { error } = reqDataSchema.validate({ ...req.body, ...req.params });

  if (error) {
    const resBody = formatValidationError(error);
    return res.status(400).json(resBody);
  }

  try {
    const {
      id,
      ...updates
    }: Partial<Omit<TDocProps, "owner">> & { id: string } = {
      ...req.body,
      ...req.params,
    };

    const oldDoc = (await DocumentModel.findOne({ _id: id }).populate(
      "owner",
      "-password -refreshToken"
    )) as IDocument;

    const updatedDoc = await DocumentModel.findByIdAndUpdate(id, updates, {
      runValidators: true,
      new: true,
    }).populate("owner", "-password -refreshToken");

    if (!updatedDoc) {
      return res.status(400).json({ message: "Document not found" });
    }

    //** Create a version of the document
    await createDocVersion({
      newDoc: updatedDoc,
      oldDoc,
      changedBy: (req as any)?.user?.id,
    });

    res.status(200).json({ message: "Document updated", data: updatedDoc });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getDocumentsByUser: RequestHandler = async (req, res) => {
  const userId = mongoose.Types.ObjectId.createFromHexString(
    (req as any)?.user?.id
  );

  try {
    // Aggregation query to get documents where the user is the owner or a collaborator
    const result = await DocumentModel.aggregate([
      {
        $match: {
          $or: [
            { owner: userId }, // User is the owner
            { collaborators: userId }, // User is a collaborator
          ],
        },
      },
      {
        $group: {
          _id: null, // We don't need to group by a specific field, just aggregate all documents
          owned: {
            $push: {
              $cond: [
                { $eq: ["$owner", userId] }, // Check if user is owner
                "$$ROOT", // Include the document in the "owned" list if the user is the owner
                null, // Otherwise, add null
              ],
            },
          },
          sharedWithMe: {
            $push: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$owner", userId] },
                    { $in: [userId, "$collaborators"] },
                  ],
                }, // User is a collaborator but not the owner
                "$$ROOT",
                null,
              ],
            },
          },
        },
      },
      {
        $project: {
          owned: {
            $filter: {
              input: "$owned",
              as: "doc",
              cond: { $ne: ["$$doc", null] },
            },
          }, // Remove null values (non-owned)
          sharedWithMe: {
            $filter: {
              input: "$sharedWithMe",
              as: "doc",
              cond: { $ne: ["$$doc", null] },
            },
          }, // Remove null values (non-collaborated)
        },
      },
    ]);

    if (result.length === 0) {
      return res
        .status(404)
        .json({ message: "No documents found for the user" });
    }

    // Return the documents categorized
    return res.status(200).json(result[0]);
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
