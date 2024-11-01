import { RequestHandler } from "express";
import Joi from "joi";
import DocumentModel from "../models/Document";
import { isValidObjectId } from "mongoose";
import { formatValidationError } from "../helpers/errors";

export const addDocument: RequestHandler = async (req, res) => {
  const bodySchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    owner: Joi.string()
      .custom((value) => isValidObjectId(value), "ObjectId")
      .required(),
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

  const { title, content, owner } = req.body;
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
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteDocument: RequestHandler = async (req, res) => {
  console.dir(req.params);
  const bodySchema = Joi.object({
    id: Joi.string()
      .custom((value, helpers) => {
        if (!isValidObjectId(value)) {
          return helpers.error("any.custom", {
            message: "Invalid ObjectId format",
          });
        }
        return value;
      }, "ObjectId")
      .required(),
  });
  const { error } = bodySchema.validate(req.params);
  console.log({ error });

  if (error) {
    const resBody = formatValidationError(error);
    return res.status(400).json(resBody);
  }

  try {
    const { id } = req.query;
    const removedDoc = await DocumentModel.findByIdAndDelete(id);
    return res.status(200).json({ removedDoc, docId: id });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
