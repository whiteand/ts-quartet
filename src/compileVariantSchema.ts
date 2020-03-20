import { compile } from "./compile";
import { ValidatorType } from "./constants";
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
): ValidatorWithSchema<{
  type: ValidatorType;
  innerSchema: IVariantSchema;
}> => {
  const validators: Validator[] = [];
  let dict: Record<string | number, boolean> = {};
  const primitives: (boolean | null | undefined)[] = [];
  for (let i = 0; i < schema.length; i++) {
    const innerSchema = schema[i];
    if (typeof innerSchema === "string" || typeof innerSchema === "number") {
      dict[innerSchema] = true;
    } else if (innerSchema == null || typeof innerSchema === "boolean") {
      primitives.push(innerSchema);
    } else {
      validators.push(compile(settings, innerSchema));
    }
  }
  const resValidator: Validator = (value, explanations, parents): boolean => {
    const innerExplanations: any[] = [];
    const isValid =
      dict[value] ||
      primitives.indexOf(value) >= 0 ||
      validators.some((check: Validator) =>
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
  return Object.assign(resValidator, {
    schema: {
      innerSchema: schema,
      type: ValidatorType.Variant
    }
  });
};
