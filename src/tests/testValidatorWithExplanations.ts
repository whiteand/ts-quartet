import { IExplanation } from "../explanations";
import { CompilationResult } from "../types";

export function testValidatorWithExplanations(
  validator: CompilationResult<any, any>,
  valids: any[],
  invalids: Array<[any, IExplanation[]]>
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
