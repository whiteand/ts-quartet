import { ValidatorType } from "./constants";
import { doExplanations } from "./doExplanation";
import {
  Explanation,
  InstanceSettings,
  Validator,
  ValidatorWithSchema
} from "./types";

export const compileFunction = (
  settings: InstanceSettings,
  schema: Validator,
  explanation?: Explanation
): ValidatorWithSchema<{ type: ValidatorType; innerSchema: Validator }> => {
  const res: Validator = (value, explanations, parents): boolean => {
    const isValid = schema(value, explanations, parents);
    if (!isValid) {
      doExplanations(
        value,
        schema,
        settings,
        parents,
        explanation,
        explanations
      );
      return false;
    }
    return isValid;
  };
  return Object.assign(res, {
    schema: {
      innerSchema: schema,
      type: ValidatorType.Function
    }
  });
};
