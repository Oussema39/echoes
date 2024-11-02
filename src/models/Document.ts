import { model, Schema } from "mongoose";
import { IDocument } from "../interface/IDocument";

const documentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

const DocumentModel = model("Document", documentSchema);

export default DocumentModel;
