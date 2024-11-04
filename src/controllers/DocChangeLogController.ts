import { TDocProps } from "../types/TDocProps";

export type CreateDocProps = {
  oldDoc: Partial<TDocProps>;
  newDoc: Partial<TDocProps>;
};

export const createDocVersion = async ({
  oldDoc,
  newDoc,
}: CreateDocProps) => {};
