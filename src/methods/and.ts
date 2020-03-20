import { compile } from "../compile";
import { ValidatorType } from "../constants";
import { GetFromSettings, Schema, TypeGuardValidator } from "../types";
import { AndMethod } from "./index";

export const getAndMethod: GetFromSettings<AndMethod> = settings => <T = any>(
  ...schemas: Schema[]
) => {
  const compiledValidators = schemas.map(schema => compile(settings, schema));
  const andValidator: TypeGuardValidator<T> = (
    value,
    explanations,
    parents = []
  ): value is T => {
    return compiledValidators.every(check =>
      check(value, explanations, parents)
    );
  };
  const andValidatorWithSchema: TypeGuardValidator<T> & {
    schema: {
      type: ValidatorType;
      innerSchema: Schema[];
    };
  } = Object.assign(andValidator, {
    schema: { type: ValidatorType.And, innerSchema: schemas }
  });
  return andValidatorWithSchema;
};
