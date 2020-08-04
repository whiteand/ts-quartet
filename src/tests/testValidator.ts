import { CompilationResult } from "../types";

export function testValidator(
  validator: CompilationResult<any, any>,
  valids: any[],
  invalids: any[]
) {
  expect(typeof validator).toBe("function");
  expect(Array.isArray(validator.explanations)).toBe(true);
  for (const valid of valids) {
    expect(validator(valid) === true ? valid : [valid]).toBe(valid);
  }
  for (const invalid of invalids) {
    expect(validator(invalid) === false ? invalid : [invalid]).toBe(invalid);
  }
}
