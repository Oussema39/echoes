import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age?: number;
  emailVerified?: boolean;
  refreshToken?: string;
  verificationToken?: string;
  updatedAt: Date;
  createdAt: Date;
}
