import { compile } from "../compile";
import {
  GetFromSettings,
  Schema,
  Validator,
  ValidatorWithSchema
} from "../types";

type ArrayOfMethod = (schema: Schema) => ValidatorWithSchema<{ type: "ARRAY_OF", innerSchema: Schema }>;

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
      isValid =
        isValid && compiledElementValidator(elem, explanations, currentParents);
      if (!isValid && !allErrors) {
        return false;
      }
    }
    return isValid;
  };
  const result = Object.assign(arrayValidator, {
    schema: { type: "ARRAY_OF", innerSchema: schema }
  });
  function getArrayValidator() {
    return result;
  }
  return result as ValidatorWithSchema<{ type: 'ARRAY_OF', innerSchema: Schema }>;
};
