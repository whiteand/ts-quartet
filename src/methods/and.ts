import { compile } from "../compile";
import { ValidatorType } from "../constants";
import {
  GetFromSettings,
  Schema,
  TypeGuardValidator,
  Validator
} from "../types";
import { AndMethod } from "./index";

export const getAndMethod: GetFromSettings<AndMethod> = settings => <T = any>(
  ...schemas: Schema[]
) => {
  const compiledValidators: Validator[] = [];
  // tslint:disable-next-line
  for (let i = 0; i < schemas.length; i++) {
    compiledValidators.push(compile(settings, schemas[i]));
  }
  const andValidator: TypeGuardValidator<T> = (
    value,
    explanations,
    parents = []
  ): value is T => {
    // tslint:disable-next-line
    for (let i = 0; i < compiledValidators.length; i++) {
      if (!compiledValidators[i](value, explanations, parents)) {
        return false;
      }
    }
    return true;
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
