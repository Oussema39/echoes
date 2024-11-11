import Joi from "joi";
import { joiCustomObjectId } from "./errors";
import { TPermissionLevel } from "../types/TPermissionLevel";

export const joiCollaborators = Joi.array().items(
  Joi.object({
    userId: joiCustomObjectId(),
    permissionLevel: Joi.string()
      .allow(...Object.values(TPermissionLevel))
      .optional(),
  })
);
