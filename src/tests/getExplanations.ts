import { CompilationResult } from "../types";

export function getExplanations<E>(
  validator: CompilationResult<any, E>,
  value: any
): E[] {
  validator(value);
  return validator.explanations;
}
