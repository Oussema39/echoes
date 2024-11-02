import { Document } from "mongoose";
import { IDocument } from "../interface/IDocument";

export type TDocProps = Omit<IDocument, keyof Document>;
