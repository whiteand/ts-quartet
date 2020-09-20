import { TSchema, CompilationResult } from "../../types";
import { getValidatorFromSchema } from "./getValidatorFromSchema";

export function vCompileSchema<T = any>(schema: TSchema): CompilationResult<T, any> {
  const explanations: any[] = [];
  const validator = getValidatorFromSchema<T>(schema);
  return Object.assign(validator, { explanations });
}
