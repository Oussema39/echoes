import { BASE_PERMISSIONS } from "../constants/permissions";

export type TPermission =
  (typeof BASE_PERMISSIONS)[keyof typeof BASE_PERMISSIONS];
