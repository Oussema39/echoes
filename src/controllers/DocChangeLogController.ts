import DocChangeLogModel from "../models/DocumentChangeLog";
import { IDocument } from "../interface/IDocument";
import { docChangeLogToDoc, docToDocChangeLog } from "../utils/formatters";
import { IDocChangeLog } from "../interface/IDocChangeLog";
import DocumentModel from "../models/Document";

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

    const docChangeLogData = docToDocChangeLog({
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

export const rollbackToVersion = async (
  version: number,
  documentId: string
) => {
  try {
    const docVersion = await DocChangeLogModel.findOne({
      documentId,
      version,
    }).lean<IDocChangeLog>();

    if (!docVersion) {
      throw new Error(`Couldn't find doc log with version: ${version} `);
    }
    const versionChanges = docChangeLogToDoc(docVersion);

    const rolledBackDoc = await DocumentModel.findByIdAndUpdate(
      documentId,
      versionChanges,
      { lean: true, new: true }
    );

    await DocChangeLogModel.deleteMany({
      documentId,
      version: { $gt: version },
    });

    return rolledBackDoc;
  } catch (error) {
    throw error;
  }
};
