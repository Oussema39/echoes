import mongoose, { Document as MDocument } from "mongoose";
import { TPermissionLevel } from "../types/TPermissionLevel";

interface ICollaborators {
  userId: string;
  permissionLevel: TPermissionLevel;
}

interface IShareLink {
  shareId: string;
  permissionLevel: TPermissionLevel;
  isActive?: boolean;
  revokeAt?: number;
}

export interface IDocument extends MDocument {
  title: string;
  content?: string;
  owner: mongoose.Schema.Types.ObjectId;
  collaborators?: ICollaborators[];
  shareLinks?: IShareLink[];
}
