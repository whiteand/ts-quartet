import { Z } from "../../infer";
import { CompilationResult, TSchema, Validator } from "../../types";
import { getValidatorFromSchema } from "./getValidatorFromSchema";

export function vCompileSchema<T = any>(
  schema: TSchema
): CompilationResult<T, any> {
  const explanations: any[] = [];
  const validator = getValidatorFromSchema(schema, undefined) as Validator<T>;
  return Object.assign(validator, {
    explanations,
    schema,
    cast() {
      return this as Z;
    },
  });
}
