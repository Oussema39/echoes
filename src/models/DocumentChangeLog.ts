import { model, Schema } from "mongoose";

const docChangeLogSchema = new Schema({
  documentId: {
    type: Schema.Types.ObjectId,
    ref: "Document",
  },
  changes: {
    title: { type: { oldValue: String, newValue: String } },
    content: { type: { oldValue: String, newValue: String } },
  },
  version: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  changedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

const DocChangeLogModel = model("DocChangeLog", docChangeLogSchema);

export default DocChangeLogModel;
