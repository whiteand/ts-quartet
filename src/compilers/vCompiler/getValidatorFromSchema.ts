import { Validator, TSchema } from "../../types";
import { validate } from "./validate";

export function getValidatorFromSchema<T>(schema: TSchema): Validator<T> {
  switch (schema) {
    default:
      return ((value: any) => validate(value, schema, [])) as Validator<T>;
  }
}
