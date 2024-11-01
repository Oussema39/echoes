import Joi, { ValidationError } from "joi";
import { TValidationErrorObj } from "../types/TValidationErrorObj";
import { isValidObjectId } from "mongoose";

export const formatValidationError = (
  error: ValidationError | undefined
): Nullable<TValidationErrorObj> => {
  if (!error) return null;

  const response = {
    message: "Validation error",
    details: error.details.map((err) => ({
      field: err.context?.key,
      message: `${err.message} ${err.context?.message}`,
    })),
  };

  return response;
};

export const joiCustomObjectId = (
  customMessage: string = "Invalid ObjectId format"
) => {
  return Joi.string().custom((value, helpers) => {
    if (!isValidObjectId(value)) {
      return helpers.error("any.custom", {
        message: customMessage,
      });
    }
    return value;
  }, "ObjectId");
};
