import { model, Schema } from "mongoose";
import { IDocument } from "../interface/IDocument";
import { TPermissionLevel } from "../types/TPermissionLevel";
import DocChangeLogModel from "./DocumentChangeLog";

const documentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    content: { type: String, default: "" },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collaborators: [
      new Schema(
        {
          userId: { type: Schema.Types.ObjectId, ref: "User" },
          permissionLevel: {
            type: String,
            enum: TPermissionLevel,
            default: TPermissionLevel.VIEWER,
          },
        },
        { _id: false }
      ),
    ],
  },
  {
    timestamps: true,
  }
);

documentSchema.post("deleteOne", async (doc) => {
  try {
    await DocChangeLogModel.deleteMany({ documentId: doc._id });
  } catch (error) {
    throw error;
  }
});

const DocumentModel = model("Document", documentSchema);

export default DocumentModel;
