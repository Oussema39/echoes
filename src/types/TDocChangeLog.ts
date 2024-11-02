import { Document } from "mongoose";
import { IDocChangeLog } from "../interface/IDocChangeLog";

export type TDocChangeLogProps = Omit<IDocChangeLog, keyof Document>;
