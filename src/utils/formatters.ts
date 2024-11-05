import { CreateDocProps } from "../controllers/DocChangeLogController";

type FormatLogProps = CreateDocProps & { changedBy: string; version: number };

export const formatDocChangeLog = ({
  newDoc,
  oldDoc,
  changedBy,
  version,
}: FormatLogProps) => {
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
