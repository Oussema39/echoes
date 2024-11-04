import { CreateDocProps } from "../controllers/DocChangeLogController";
import { TBase } from "../types/TBase";
import { TDocChangeLogProps } from "../types/TDocChangeLog";

type FormatLogProps = CreateDocProps & { changedBy: string; version: number };

export const formatDocChangeLog = ({
  newDoc,
  oldDoc,
  changedBy,
  version,
}: FormatLogProps) => {
  const changes: Omit<TDocChangeLogProps, keyof TBase> = {
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
