import { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age?: number;
  updatedAt: Date;
  createdAt: Date;
}