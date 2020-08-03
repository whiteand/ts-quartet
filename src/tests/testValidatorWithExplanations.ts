import { CompilationResult } from "../types";
import { IExplanation } from "../explanations";

export function testValidatorWithExplanations(
  validator: CompilationResult<any, any>,
  valids: any[],
  invalids: [any, IExplanation[]][]
) {
  expect(typeof validator).toBe("function");
  expect(Array.isArray(validator.explanations)).toBe(true);
  for (const valid of valids) {
    expect(validator(valid) ? valid : [valid]).toBe(valid);
  }
  for (const [invalid, explanations] of invalids) {
    expect(validator(invalid) ? [invalid] : invalid).toBe(invalid);
    expect(validator.explanations).toEqual(explanations);
  }
}
