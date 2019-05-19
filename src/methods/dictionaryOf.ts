import { compile } from "../compile";
import {
  GetFromSettings,
  IDictionary,
  Schema,
  TypeGuardValidator
} from "../types";
import { ValidatorType } from "./constants";
import { DictionaryOfMethod } from "./index";

export const getDictionaryOfMethod: GetFromSettings<
  DictionaryOfMethod
> = settings => <T = any>(schema: Schema) => {
  const valuesValidator = compile(settings, schema);
  const { allErrors = false } = settings;
  const dictionaryOfValidator: TypeGuardValidator<IDictionary<T>> = (
    value,
    explanations,
    parents = []
  ): value is IDictionary<T> => {
    if (!value || typeof value !== "object") {
      return false;
    }
    const entries = Object.entries(value);
    const getParent = (key: string) => ({
      key,
      parent: value,
      schema: getValidatorWithSchema()
    });
    let isValid = true;
    for (const [key, propValue] of entries) {
      const currentParents = [getParent(key), ...parents];
      const isValidPropValue = valuesValidator(
        propValue,
        explanations,
        currentParents
      );
      isValid = isValid && isValidPropValue;
      if (!isValid && !allErrors) {
        return false;
      }
    }
    return isValid;
  };
  const validatorWithSchema: TypeGuardValidator<IDictionary<T>> & {
    schema: { type: ValidatorType; innerSchema: Schema };
  } = Object.assign(dictionaryOfValidator, {
    schema: { type: ValidatorType.DictionaryOf, innerSchema: schema }
  });
  function getValidatorWithSchema() {
    return validatorWithSchema;
  }
  return validatorWithSchema;
};
