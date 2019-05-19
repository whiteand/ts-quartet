import {
  IDictionary,
  InstanceSettings,
  Schema,
  TypeGuardValidator,
  ValidatorWithSchema
} from "../types";
import { getArrayValidator } from "./array";
import { getArrayOfValidator } from "./arrayOf";
import { ValidatorType } from "./constants";
import { getDictionaryOfMethod } from "./dictionaryOf";
import { getEnumMethod } from "./enum";
import { getNumberValidator } from "./number";
import { getSafeIntegerValidator } from "./safeInteger";
import {
  getNegativeValidator,
  getNonNegativeValidator,
  getNonPositiveValidator,
  getPositiveValidator
} from "./signs";

type FromSettings<T = any> = (settings: InstanceSettings) => T;
export type ArrayMethod = TypeGuardValidator<any[]> & {
  schema: { type: ValidatorType };
};
export type ArrayOfMethod = <T = any>(
  schema: Schema
) => TypeGuardValidator<T[]> & {
  schema: { type: ValidatorType; innerSchema: Schema };
};
export type EnumMethod = (
  ...values: any
) => ValidatorWithSchema<{ type: ValidatorType; innerSchema: any[] }>;

export type DictionaryOfMethod = <T = any>(
  schema: Schema
) => TypeGuardValidator<IDictionary<T>> & {
  schema: { type: ValidatorType; innerSchema: Schema };
};

export type NumberValidationMethod = TypeGuardValidator<number> & {
  schema: { type: ValidatorType };
};

export interface IMethods {
  array: ArrayMethod;
  arrayOf: ArrayOfMethod;
  enum: EnumMethod;
  dictionaryOf: DictionaryOfMethod;
  safeInteger: NumberValidationMethod;
  number: NumberValidationMethod;
  positive: NumberValidationMethod;
  negative: NumberValidationMethod;
  nonNegative: NumberValidationMethod;
  nonPositive: NumberValidationMethod;
}

export const getMethods: FromSettings<IMethods> = settings => {
  const methods: IMethods = {
    array: Object.assign(getArrayValidator(settings), {
      schema: { type: ValidatorType.Array }
    }),
    arrayOf: getArrayOfValidator(settings),
    dictionaryOf: getDictionaryOfMethod(settings),
    enum: getEnumMethod(settings),
    negative: Object.assign(getNegativeValidator(settings), {
      schema: { type: ValidatorType.Negative }
    }),
    nonNegative: Object.assign(getNonNegativeValidator(settings), {
      schema: { type: ValidatorType.NonNegative }
    }),
    nonPositive: Object.assign(getNonPositiveValidator(settings), {
      schema: { type: ValidatorType.NonPositive }
    }),
    number: Object.assign(getNumberValidator(settings), {
      schema: { type: ValidatorType.Number }
    }),
    positive: Object.assign(getPositiveValidator(settings), {
      schema: { type: ValidatorType.Positive }
    }),
    safeInteger: Object.assign(getSafeIntegerValidator(settings), {
      schema: { type: ValidatorType.SafeInteger }
    })
  };
  return methods;
};
