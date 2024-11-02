import { TDocProps } from "../types/TDocProps";

export interface IDocChangeLog {
  documentId: string;
  changes: Pick<TDocProps, "title" | "content">;
  version?: number;
  timestamp: number;
  changedBy: string;
}
