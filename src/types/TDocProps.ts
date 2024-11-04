import { Document } from "mongoose";
import { IDocument } from "../interface/IDocument";
import { TBase } from "./TBase";

export type TDocProps = Omit<IDocument, keyof Document> & TBase;
