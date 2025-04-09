import { CompilationResult, Z } from "../types";

export function testValidatorImpure(
  validator: CompilationResult<Z, Z>,
  valids: Z[],
  invalids: Z[],
  matchExplanationSnapshot: boolean = false
) {
  expect(typeof validator).toBe("function");
  expect(Array.isArray(validator.explanations)).toBe(true);
  for (const valid of valids) {
    expect(validator(valid) === true ? valid : [valid]).toBe(valid);
    expect(validator.explanations).toEqual([]);
  }
  for (const invalid of invalids) {
    expect(validator(invalid) === false ? invalid : [invalid]).toBe(invalid);
    expect(validator.explanations.length > 0 ? invalid : [invalid]).toBe(
      invalid
    );

    if (matchExplanationSnapshot) {
      expect(validator.explanations).toMatchSnapshot();
    }
  }
}
