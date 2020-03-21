import { compile } from "../compile";
import { ValidatorType } from "../constants";
import { GetFromSettings, Schema, TypeGuardValidator } from "../types";
import { ArrayOfMethod } from "./index";

export const getArrayOfValidator: GetFromSettings<ArrayOfMethod> = settings => <
  T = any
>(
  schema: Schema
) => {
  const compiledElementValidator = compile(settings, schema);
  const { allErrors = false } = settings;
  const arrayValidator: TypeGuardValidator<T[]> = (
    value,
    explanations,
    parents = []
  ): value is T[] => {
    if (!Array.isArray(value)) {
      return false;
    }

    let isValid = true;
    for (let i = 0; i < value.length; i++) {
      const elem = value[i];
      const currentParents = [
        {
          key: i,
          parent: value,
          schema: getArrayValidator()
        },
        ...parents
      ];
      const isValidElem = compiledElementValidator(
        elem,
        explanations,
        currentParents
      );
      isValid = isValid && isValidElem;
      if (!isValid && !allErrors) {
        return false;
      }
    }
    return isValid;
  };
  const result: TypeGuardValidator<T[]> & {
    schema: {
      type: ValidatorType;
      innerSchema: Schema;
    };
  } = Object.assign(arrayValidator, {
    schema: { type: ValidatorType.ArrayOf, innerSchema: schema }
  });
  function getArrayValidator() {
    return result;
  }
  return result;
};
