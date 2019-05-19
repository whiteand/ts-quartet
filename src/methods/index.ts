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

export interface IMethods {
  array: ArrayMethod;
  arrayOf: ArrayOfMethod;
  enum: EnumMethod;
  dictionaryOf: DictionaryOfMethod;
}

export const getMethods: FromSettings<IMethods> = settings => {
  const methods: IMethods = {
    array: Object.assign(getArrayValidator(settings), {
      schema: { type: ValidatorType.Array }
    }),
    arrayOf: getArrayOfValidator(settings),
    dictionaryOf: getDictionaryOfMethod(settings),
    enum: getEnumMethod(settings)
  };
  return methods;
};
