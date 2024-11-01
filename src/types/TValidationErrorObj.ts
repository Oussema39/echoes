type TErrorDetail = {
  field: string | undefined;
  message: string;
};

export type TValidationErrorObj = {
  message: string;
  details: TErrorDetail[];
};
