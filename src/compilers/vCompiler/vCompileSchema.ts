import { Z } from "../../types";
import { CompilationResult, TSchema, Validator } from "../../types";
import { getValidatorFromSchema } from "./getValidatorFromSchema";

export function vCompileSchema<T = Z>(
  schema: TSchema
): CompilationResult<T, Z> {
  const explanations: Z[] = [];
  const validator = getValidatorFromSchema(schema, undefined) as Validator<T>;
  return Object.assign(validator, {
    explanations,
    schema,
    cast() {
      return this as Z;
    },
  });
}
