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
): ValidatorWithSchema => {
  const res: ValidatorWithSchema = (value, explanations, parents): boolean => {
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
  res.schema = schema;
  return res;
};
