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
  const compiledValidators: (
    | Validator
    | string
    | null
    | number
    | boolean
    | undefined
    | symbol)[] = [];
  // tslint:disable-next-line
  for (let i = 0; i < schemas.length; i++) {
    const schema = schemas[i];
    compiledValidators.push(
      schema && typeof schema === "object"
        ? compile(settings, schemas[i])
        : schema
    );
  }
  const andValidator: TypeGuardValidator<T> = (
    value,
    explanations,
    parents = []
  ): value is T => {
    // tslint:disable-next-line
    for (let i = 0; i < compiledValidators.length; i++) {
      const validator = compiledValidators[i];
      if (
        typeof validator === "function"
          ? !validator(value, explanations, parents)
          : value !== validator
      ) {
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
