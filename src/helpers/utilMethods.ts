import { IDocument } from "../interface/IDocument";
import { TPermissionLevel } from "../types/TPermissionLevel";
import { TDocProps } from "../types/TDocProps";
import { DocPermissions } from "../constants/permissions";

export const hasPermission = (
  action: TPermissionLevel,
  userId: string,
  doc: IDocument | TDocProps
): Boolean => {
  const userPermissionLevel = doc.collaborators?.find(
    (clb) => userId === clb.userId
  );
  if (!userPermissionLevel) return false;

  const allowedPermissions =
    DocPermissions[userPermissionLevel.permissionLevel!];
  const isPermitted = allowedPermissions.includes(action);

  return isPermitted;
};
