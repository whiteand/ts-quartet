import { InstanceSettings, Schema, ValidatorWithSchema } from "../types";
import { getArrayValidator } from "./array";
import { getArrayOfValidator } from "./arrayOf";
import { ValidatorType } from "./constants";
import { getDictionaryOfMethod } from "./dictionaryOf";
import { getEnumMethod } from "./enum";

type FromSettings<T = any> = (settings: InstanceSettings) => T;
export type ArrayMethod = ValidatorWithSchema<{ type: ValidatorType }>;
export type ArrayOfMethod = (
  schema: Schema
) => ValidatorWithSchema<{ type: ValidatorType; innerSchema: Schema }>;
export type EnumMethod = (
  ...values: any
) => ValidatorWithSchema<{ type: ValidatorType; innerSchema: any[] }>;

export type DictionaryOfMethod = (
  schema: Schema
) => ValidatorWithSchema<{ type: ValidatorType; innerSchema: Schema }>;

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
