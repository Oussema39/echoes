import { Document } from "mongoose";
import { TAuthProvider } from "../types/TAuthProvider";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  provider: `${TAuthProvider}`;
  password?: string;
  picture?: string;
  googleId?: string;
  age?: number;
  emailVerified?: boolean;
  refreshToken?: string;
  verificationToken?: string;
  updatedAt: Date;
  createdAt: Date;
  extras: Record<string, unknown>;
}
