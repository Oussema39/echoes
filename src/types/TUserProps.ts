import { Document } from "mongoose";
import { IUser } from "../interface/IUser";
import { TBase } from "./TBase";

export type TUserProps = Partial<Omit<IUser, keyof Document>> & TBase;
