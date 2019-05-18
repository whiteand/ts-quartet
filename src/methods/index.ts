import { InstanceSettings, Validator } from "../types";
import { getArrayValidator } from "./array";

type FromSettings<T = any> = (settings: InstanceSettings) => T;

export interface IMethods {
  array: Validator;
}

export const getMethods: FromSettings<IMethods> = settings => {
  const methods: IMethods = {
    array: getArrayValidator(settings)
  };
  return methods;
};
