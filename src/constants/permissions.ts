import { TPermissionLevel } from "../types/TPermissionLevel";

const BASE_PERMISSIONS = Object.seal({
  READ: "read",
  WRITE: "write",
  DELETE: "delete",
  SHARE: "share",
});

export const DocPermissions = Object.seal({
  [TPermissionLevel.VIEWER]: [BASE_PERMISSIONS.READ],
  [TPermissionLevel.EDITOR]: [BASE_PERMISSIONS.READ, BASE_PERMISSIONS.WRITE],
  [TPermissionLevel.MANAGER]: [
    BASE_PERMISSIONS.READ,
    BASE_PERMISSIONS.WRITE,
    BASE_PERMISSIONS.DELETE,
  ],
  [TPermissionLevel.OWNER]: [...Object.values(BASE_PERMISSIONS)],
});
