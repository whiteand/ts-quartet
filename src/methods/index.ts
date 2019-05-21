import { getThrowErrorMethod } from './throwError';
import {
  Explanation,
  GetFromSettings,
  IDictionary,
  ITest,
  Schema,
  TypeGuardValidator,
  ValidatorWithSchema
} from "../types";
import { getAndMethod } from "./and";
import { getArrayValidator } from "./array";
import { getArrayOfValidator } from "./arrayOf";
import { getBooleanValidator } from "./boolean";
import { ValidatorType } from "./constants";
import { getDictionaryOfMethod } from "./dictionaryOf";
import { getEnumMethod } from "./enum";
import { getExplainMethod } from "./explain";
import { getJustMethod } from "./just";
import { getMaxMethod, getMinMethod } from "./minmax";
import { getNumberValidator } from "./number";
import { getSafeIntegerValidator } from "./safeInteger";
import {
  getNegativeValidator,
  getNonNegativeValidator,
  getNonPositiveValidator,
  getPositiveValidator
} from "./signs";
import { getStringValidator } from "./string";
import { getTestMethod } from "./testMethod";

export type AndMethod = (
  ...schemas: Schema[]
) => ValidatorWithSchema<{ type: ValidatorType; innerSchema: Schema[] }>;

export type ArrayMethod = TypeGuardValidator<any[]> & {
  schema: { type: ValidatorType };
};
export type ArrayOfMethod = <T = any>(
  elementSchema: Schema
) => TypeGuardValidator<T[]> & {
  schema: { type: ValidatorType; innerSchema: Schema };
};

export type BooleanMethod = TypeGuardValidator<boolean> & {
  schema: { type: ValidatorType };
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

export type StringMethod = TypeGuardValidator<string> & {
  schema: { type: ValidatorType };
};

export type TestMethod = (
  test: ITest
) => ValidatorWithSchema<{ type: ValidatorType; innerSchema: ITest }>;

export type ThrowErrorMethod = <T = any>(
  schema: Schema,
  errorMessage: string | ((value: any) => string)
) => (value: any) => T;

export type MinMethod = (
  minValue: number,
  exclusive?: boolean
) => TypeGuardValidator<string | number | any[]> & {
  schema: {
    type: ValidatorType;
    innerSchema: { minValue: number; exclusive: boolean };
  };
};

export type MaxMethod = (
  maxValue: number,
  exclusive?: boolean
) => TypeGuardValidator<string | number | any[]> & {
  schema: {
    type: ValidatorType;
    innerSchema: { maxValue: number; exclusive: boolean };
  };
};

export type JustMethod = <T = any>(
  schema?: Schema
) => (value: any) => value is T;

export type ExplainMethod = (
  schema?: Schema,
  explanation?: Explanation
) => (value: any) => null | any[];

export interface IMethods {
  and: AndMethod;
  array: ArrayMethod;
  arrayOf: ArrayOfMethod;
  boolean: BooleanMethod;
  dictionaryOf: DictionaryOfMethod;
  enum: EnumMethod;
  explain: ExplainMethod;
  just: JustMethod;
  max: MaxMethod;
  min: MinMethod;
  negative: NumberValidationMethod;
  nonNegative: NumberValidationMethod;
  nonPositive: NumberValidationMethod;
  number: NumberValidationMethod;
  positive: NumberValidationMethod;
  safeInteger: NumberValidationMethod;
  string: StringMethod;
  test: TestMethod;
  throwError: ThrowErrorMethod;
}

export const getMethods: GetFromSettings<IMethods> = settings => {
  const methods: IMethods = {
    and: getAndMethod(settings),
    array: Object.assign(getArrayValidator(settings), {
      schema: { type: ValidatorType.Array }
    }),
    arrayOf: getArrayOfValidator(settings),
    boolean: Object.assign(getBooleanValidator(settings), {
      schema: { type: ValidatorType.Boolean }
    }),
    dictionaryOf: getDictionaryOfMethod(settings),
    enum: getEnumMethod(settings),
    explain: getExplainMethod(settings),
    just: getJustMethod(settings),
    max: getMaxMethod(settings),
    min: getMinMethod(settings),
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
    }),
    string: Object.assign(getStringValidator(settings), {
      schema: { type: ValidatorType.String }
    }),
    test: getTestMethod(settings),
    throwError: getThrowErrorMethod(settings)
  };
  return methods;
};
