import { ValidationError } from "joi";
import { TValidationErrorObj } from "../types/TValidationErrorObj";

export const formatValidationError = (
  error: ValidationError | undefined
): Nullable<TValidationErrorObj> => {
  if (!error) return null;

  const response = {
    message: "Validation error",
    details: error.details.map((err) => ({
      field: err.context?.key,
      message: err.message,
    })),
  };

  return response;
};
