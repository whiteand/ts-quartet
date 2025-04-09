import { CompilationResult, Z } from "../types";
import { expect } from "vitest";

export function testValidator(
  validator: CompilationResult<Z, Z>,
  valids: Z[],
  invalids: Z[],
) {
  expect(typeof validator).toBe("function");
  expect(Array.isArray(validator.explanations)).toBe(true);
  for (const valid of valids) {
    expect(validator(valid) === true ? valid : [valid]).toBe(valid);
    expect(validator.explanations).toEqual([]);
  }
  for (const invalid of invalids) {
    expect(validator(invalid) === false ? invalid : [invalid]).toBe(invalid);
    expect(validator.explanations).toEqual([]);
  }
}
