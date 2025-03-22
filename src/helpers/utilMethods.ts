import { IDocument } from "../interface/IDocument";
import { TDocProps } from "../types/TDocProps";
import { DocPermissions } from "../constants/permissions";
import { TPermission } from "../types/TPermission";

export const hasPermission = (
  action: TPermission,
  userId: string,
  doc: IDocument | TDocProps | null
): Boolean => {
  if (!doc) {
    console.error("hasPermission:", "doc is null");
    return false;
  }

  if (doc.owner.toString() === userId) return true;

  const userPermissionLevel = doc.collaborators?.find(
    (clb) => userId === clb.userId
  );
  if (!userPermissionLevel) return false;

  const allowedPermissions: Readonly<TPermission[]> =
    DocPermissions[userPermissionLevel.permissionLevel!];
  const isPermitted = allowedPermissions.includes(action);

  return isPermitted;
};
