import { compile } from "../compile";
import {
  GetFromSettings,
  Schema,
  Validator,
  ValidatorWithSchema
} from "../types";
import { ValidatorType } from "./constants";
import { ArrayOfMethod } from "./index";

export const getArrayOfValidator: GetFromSettings<
  ArrayOfMethod
> = settings => schema => {
  const compiledElementValidator = compile(settings, schema);
  const { allErrors = false } = settings;
  const arrayValidator: Validator = (value, explanations, parents = []) => {
    if (!Array.isArray(value)) {
      return false;
    }
    const getParent = (key: number) => ({
      key,
      parent: value,
      schema: getArrayValidator()
    });
    let isValid = true;
    for (let i = 0; i < value.length; i += 1) {
      const elem = value[i];
      const currentParents = [getParent(i), ...parents];
      const isValidElem = compiledElementValidator(elem, explanations, currentParents);
      isValid = isValid && isValidElem
      if (!isValid && !allErrors) {
        return false;
      }
    }
    return isValid;
  };
  const result = Object.assign(arrayValidator, {
    schema: { type: ValidatorType.ArrayOf, innerSchema: schema }
  });
  function getArrayValidator() {
    return result;
  }
  return result as ValidatorWithSchema<{
    type: ValidatorType;
    innerSchema: Schema;
  }>;
};
