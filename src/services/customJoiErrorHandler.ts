import { ValidationErrorFunction } from "joi";

export const customErrorHandler: ValidationErrorFunction = (errors): string => {
  errors.forEach((error) => console.log(error.code));
  return errors[0].message;
};
