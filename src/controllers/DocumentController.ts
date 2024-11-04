import { RequestHandler } from "express";
import Joi from "joi";
import DocumentModel from "../models/Document";
import { formatValidationError, joiCustomObjectId } from "../helpers/errors";
import { TDocProps } from "../types/TDocProps";

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

  console.log({ user: (req as any).user });

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

    const updatedDoc = await DocumentModel.findByIdAndUpdate(id, updates, {
      runValidators: true,
      new: true,
    }).populate("owner", "-password -refreshToken");

    if (!updatedDoc) {
      return res.status(400).json({ message: "Document not found" });
    }

    res.status(200).json({ message: "Document updated", data: updatedDoc });
  } catch (error) {
    console.error("Error updating document:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
