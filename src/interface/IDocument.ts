import mongoose, { Document as MDocument } from "mongoose";
import { TPermissionLevel } from "../types/TPermissionLevel";

interface ICollaborators {
  userId: string;
  permissionLevel: TPermissionLevel;
}

export interface IDocument extends MDocument {
  title: string;
  content?: string;
  owner: mongoose.Schema.Types.ObjectId;
  collaborators?: ICollaborators[];
}
