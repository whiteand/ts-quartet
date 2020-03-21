import { compile } from "./compile";
import { ValidatorType } from "./constants";
import { doExplanations } from "./doExplanation";
import { has } from "./helpers";
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
  const dict: Record<string | number, boolean> = {};
  const primitives: Array<boolean | null | undefined> = [];

  // tslint:disable-next-line
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
      has(dict, value) ||
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
