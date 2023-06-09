import { ValidationErrorFunction } from "joi";

export const customErrorHandler: ValidationErrorFunction = (errors): string => {
  return errors[0].message;
};
