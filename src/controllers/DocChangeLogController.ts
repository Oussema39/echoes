import DocChangeLogModel from "../models/DocumentChangeLog";
import { formatDocChangeLog } from "../utils/formatters";
import { IDocument } from "../interface/IDocument";

export type CreateDocProps = {
  oldDoc: IDocument;
  newDoc: IDocument;
  changedBy: string;
};

export const createDocVersion = async ({
  newDoc,
  oldDoc,
  changedBy,
}: CreateDocProps) => {
  try {
    const latestVersionDoc = await DocChangeLogModel.findOne(
      {},
      "version"
    ).sort({
      version: -1,
    });

    const docChangeLogData = formatDocChangeLog({
      newDoc,
      oldDoc,
      changedBy,
      version: (latestVersionDoc?.version ?? 0) + 1,
    });

    const newDocChangeLog = new DocChangeLogModel(docChangeLogData);
    await newDocChangeLog.save();

    const savedDocChangeLog = await DocChangeLogModel.findOne(
      {},
      "version"
    ).sort({
      version: -1,
    });

    return savedDocChangeLog;
  } catch (error) {
    throw error;
  }
};
