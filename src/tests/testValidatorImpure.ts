import { CompilationResult } from "../types";

export function testValidatorImpure(
  validator: CompilationResult<any, any>,
  valids: any[],
  invalids: any[],
  matchExplanationSnapshot: boolean = false
) {
  expect(typeof validator).toBe("function");
  expect(Array.isArray(validator.explanations)).toBe(true);
  for (const valid of valids) {
    expect(validator(valid) ? valid : [valid]).toBe(valid);
  }
  for (const invalid of invalids) {
    expect(validator(invalid) ? [invalid] : invalid).toBe(invalid);
    expect(validator.explanations.length > 0 ? invalid : [invalid]).toBe(
      invalid
    );

    if (matchExplanationSnapshot) {
      expect(validator.explanations).toMatchSnapshot();
    }
  }
}
