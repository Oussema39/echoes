import { CreateDocProps } from "../controllers/DocChangeLogController";
import { IDocChangeLog } from "../interface/IDocChangeLog";
import { TDocChangeLogProps } from "../types/TDocChangeLog";
import { TDocProps } from "../types/TDocProps";

type DocToDocLogProps = CreateDocProps & { changedBy: string; version: number };

export const docToDocChangeLog = ({
  newDoc,
  oldDoc,
  changedBy,
  version,
}: DocToDocLogProps) => {
  const changes = {
    documentId: oldDoc._id!,
    changedBy,
    changes: {
      title: {
        newValue: newDoc.title!,
        oldValue: oldDoc.title!,
      },
      content: {
        newValue: newDoc.content!,
        oldValue: oldDoc.content!,
      },
    },
    timestamp: Date.now(),
    version,
  };

  return changes;
};

export const docChangeLogToDoc = (
  docChangeLog: IDocChangeLog | TDocChangeLogProps
): Partial<TDocProps> => {
  const { changes } = docChangeLog;
  const doc: Partial<TDocProps> = {
    content: changes.content?.newValue,
    title: changes.title?.newValue,
  };

  return doc;
};
