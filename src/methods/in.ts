import { ValidatorType } from "../constants";
import { GetFromSettings, TypeGuardValidator } from "../types";
import { InMethod } from "./index";

const emptyObject: any = {};

export const getInMethod: GetFromSettings<InMethod> = settings => <T = any>(
  dictionary: Record<any, any>
) => {
  const inValidator: TypeGuardValidator<T> = dictionary
    ? (value: any): value is T => {
        if (emptyObject[value] !== undefined) {
          return Object.hasOwnProperty.call(dictionary, value);
        }
        return dictionary[value] !== undefined;
      }
    : (value: any): value is T => false;

  const testValidatorWithSchema: TypeGuardValidator<T> & {
    schema: {
      type: ValidatorType;
      innerSchema: Record<any, any>;
    };
  } = Object.assign(inValidator, {
    schema: { type: ValidatorType.In, innerSchema: dictionary }
  });
  return testValidatorWithSchema;
};
