import { Document } from "mongoose";
import { IDocChangeLog } from "../interface/IDocChangeLog";
import { TBase } from "./TBase";

export type TDocChangeLogProps = Omit<IDocChangeLog, keyof Document> & TBase;
