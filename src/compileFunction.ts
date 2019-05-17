import { doExplanations } from "./doExplanation";
import {
  Explanation,
  InstanceSettings,
  Validator,
  ValidatorWithSchema
} from "./global.d";
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
      if (settings.onInvalid) {
        settings.onInvalid(value, schema, settings, parents);
      }
      return false;
    }
    if (settings.onValid) {
      settings.onValid(value, schema, settings, parents);
    }
    return isValid;
  };
  res.schema = schema;
  return res;
};
