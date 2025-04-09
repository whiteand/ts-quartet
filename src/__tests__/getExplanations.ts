import { CompilationResult, Z } from "../types";

export function getExplanations<E>(
  validator: CompilationResult<Z, E>,
  value: Z
): E[] {
  if (validator(value)) {
    throw new Error("valid value" + JSON.stringify(value));
  }
  return validator.explanations;
}
