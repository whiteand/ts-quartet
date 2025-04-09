import { IExplanation } from "../explanations";
import { CompilationResult, Z } from "../types";
import { expect } from "vitest";

export function testValidatorWithExplanations(
  validator: CompilationResult<Z, Z>,
  valids: Z[],
  invalids: Array<[Z, IExplanation[]]>,
) {
  expect(typeof validator).toBe("function");
  expect(Array.isArray(validator.explanations)).toBe(true);
  for (const valid of valids) {
    expect(validator(valid) === true ? valid : [valid]).toBe(valid);
  }
  for (const [invalid, explanations] of invalids) {
    expect(validator(invalid) === false ? invalid : [invalid]).toBe(invalid);
    expect(validator.explanations).toEqual(explanations);
  }
}
