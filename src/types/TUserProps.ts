import { Document } from "mongoose";
import { IUser } from "../interface/IUser";

export type TUserProps = Partial<Omit<IUser, keyof Document>>;
