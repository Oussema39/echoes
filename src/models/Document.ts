import mongoose, { Schema } from "mongoose";
import { IDocument } from "../interface/IDocument";

const documentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const DocumentModel = mongoose.model("Document", documentSchema);

export default DocumentModel;
