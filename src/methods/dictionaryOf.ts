import { GetFromSettings, Validator } from "../types";
import { ValidatorType } from "./constants";
import { DictionaryOfMethod } from "./index";
import { compile } from "../compile";

export const getDictionaryOfMethod: GetFromSettings<
  DictionaryOfMethod
> = settings => schema => {
  const valuesValidator = compile(settings, schema)
  const { allErrors = false } = settings
  const dictionaryOfValidator: Validator = (value, explanations, parents = []) => {
    if (!value) {
      return false;
    }
    const entries = Object.entries(value)
    const getParent = (key: string) => ({ key, parent: value, schema: getValidatorWithSchema()})
    let isValid = true
    for (const [key, propValue] of entries) {
      const currentParents = [
        getParent(key),
        ...parents
      ]
      const isValidPropValue = valuesValidator(propValue, explanations, currentParents)
      isValid = isValid && isValidPropValue
      if (!isValid && !allErrors) {
        return false
      }
    }
    return isValid
  };
  const validatorWithSchema = Object.assign(dictionaryOfValidator, {
    schema: { type: ValidatorType.DictionaryOf, innerSchema: schema }
  });
  function getValidatorWithSchema() {
    return validatorWithSchema
  }
  return validatorWithSchema
};
