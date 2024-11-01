import { Document } from "mongoose";
import { IDocument } from "../interface/IDocument";

export type IDocProps = Omit<IDocument, keyof Document>;
