import { model, Schema } from "mongoose";

const docChangeLogSchema = new Schema({
  documentId: {
    type: Schema.Types.ObjectId,
    ref: "Document",
  },
  changes: {
    type: [
      {
        field: { type: String, enum: ["title", "content"], required: true },
        oldValue: String,
        newValue: String,
      },
    ],
  },
  version: { type: Number, required: true },
  timeStamp: { type: Number, required: true },
  changedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const DocChangeLogModel = model("DocChangeLog", docChangeLogSchema);

export default DocChangeLogModel;
