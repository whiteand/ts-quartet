import { compile } from "../compile";
import {
  GetFromSettings,
  Schema,
  Validator,
  ValidatorWithSchema
} from "../types";
import { ValidatorType } from "../constants";
import { AndMethod } from "./index";

export const getAndMethod: GetFromSettings<AndMethod> = settings => (
  ...schemas: Schema[]
) => {
  const compiledValidators = schemas.map(schema => compile(settings, schema));
  const andValidator: Validator = (
    value,
    explanations,
    parents = []
  ): boolean => {
    return compiledValidators.every(check =>
      check(value, explanations, parents)
    );
  };
  const andValidatorWithSchema: ValidatorWithSchema<{
    type: ValidatorType;
    innerSchema: Schema[];
  }> = Object.assign(andValidator, {
    schema: { type: ValidatorType.And, innerSchema: schemas }
  });
  return andValidatorWithSchema;
};
