import mongoose, { Document as MDocument } from "mongoose";

export interface IDocument extends MDocument {
  title: string;
  content?: string;
  owner: mongoose.Schema.Types.ObjectId;
  collaborators?: string[];
}
