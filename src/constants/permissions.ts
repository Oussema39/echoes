import { TPermissionLevel } from "../types/TPermissionLevel";

export const BASE_PERMISSIONS = {
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  SHARE: "share",
} as const;

export const DocPermissions = {
  [TPermissionLevel.VIEWER]: [BASE_PERMISSIONS.READ],
  [TPermissionLevel.EDITOR]: [BASE_PERMISSIONS.READ, BASE_PERMISSIONS.WRITE],
  [TPermissionLevel.MANAGER]: [
    BASE_PERMISSIONS.READ,
    BASE_PERMISSIONS.WRITE,
    BASE_PERMISSIONS.DELETE,
  ],
  [TPermissionLevel.OWNER]: [...Object.values(BASE_PERMISSIONS)],
} as const;
