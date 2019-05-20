import {
  GetFromSettings,
  ITest,
  Schema,
  Validator,
  ValidatorWithSchema
} from "../types";
import { ValidatorType } from "./constants";
import { TestMethod } from "./index";

export const getTestMethod: GetFromSettings<TestMethod> = settings => (
  test: ITest
) => {
  const testValidator: Validator = (value): boolean => test.test(value);

  const testValidatorWithSchema: ValidatorWithSchema<{
    type: ValidatorType;
    innerSchema: ITest;
  }> = Object.assign(testValidator, {
    schema: { type: ValidatorType.Test, innerSchema: test }
  });
  return testValidatorWithSchema;
};
