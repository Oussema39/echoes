export interface IDocChangeLog {
  documentId: string;
  changes: {
    title?: { oldValue: string; newValue: string };
    content?: { oldValue: string; newValue: string };
  };
  version?: number;
  timestamp: number;
  changedBy: string;
}
