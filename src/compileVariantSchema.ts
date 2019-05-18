import { compile } from "./compile";
import { doExplanations } from "./doExplanation";
import {
  Explanation,
  InstanceSettings,
  IVariantSchema,
  Validator,
  ValidatorWithSchema
} from "./types";

export const compileVariantSchema = (
  settings: InstanceSettings,
  schema: IVariantSchema,
  explanation?: Explanation
): ValidatorWithSchema => {
  const validators = schema.map(innerSchema => compile(settings, innerSchema));
  const resValidator: ValidatorWithSchema = (
    value,
    explanations,
    parents
  ): boolean => {
    const innerExplanations: any[] = [];
    const isValid = validators.some((check: Validator) =>
      check(value, innerExplanations, parents)
    );
    if (!isValid) {
      if (explanations) {
        explanations.push(...innerExplanations);
      }
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
  resValidator.schema = schema;
  return resValidator;
};
