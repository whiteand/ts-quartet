import {
  InstanceSettings,
  Schema,
  Validator,
  ValidatorWithSchema
} from "../types";
import { getArrayValidator } from "./array";
import { getArrayOfValidator } from "./arrayOf";

type FromSettings<T = any> = (settings: InstanceSettings) => T;

export interface IMethods {
  array: Validator;
  arrayOf: (
    schema: Schema
  ) => ValidatorWithSchema<{ type: "ARRAY_OF"; innerSchema: Schema }>;
}

export const getMethods: FromSettings<IMethods> = settings => {
  const methods: IMethods = {
    array: getArrayValidator(settings),
    arrayOf: getArrayOfValidator(settings)
  };
  return methods;
};
