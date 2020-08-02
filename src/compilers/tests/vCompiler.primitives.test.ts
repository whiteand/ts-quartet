import { CompilationResult } from "../../types";
import { vCompiler } from "../vCompiler";

const testValidator = (
  validator: CompilationResult<any, any>,
  valids: any[],
  invalids: any[]
) => {
  expect(typeof validator).toBe("function");
  expect(Array.isArray(validator.explanations)).toBe(true);
  for (const valid of valids) {
    expect(validator(valid) ? valid : [valid]).toBe(valid);
  }
  for (const invalid of invalids) {
    expect(validator(invalid) ? [invalid] : invalid).toBe(invalid);
  }
};

describe("v(primitive)", () => {
  test("v(null)", () => {
    const validator = vCompiler<null>(null);
    testValidator(
      validator,
      [null],
      [undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(undefined)", () => {
    const validator = vCompiler(undefined);
    testValidator(
      validator,
      [undefined],
      [null, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(true)", () => {
    const validator = vCompiler(true);
    testValidator(
      validator,
      [true],
      [null, undefined, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(false)", () => {
    const validator = vCompiler(false);
    testValidator(
      validator,
      [false],
      [null, undefined, true, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(NaN)", () => {
    const validator = vCompiler(NaN);
    testValidator(
      validator,
      [NaN],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, {}, []]
    );
  });
  test("v(0)", () => {
    const validator = vCompiler(0);
    testValidator(
      validator,
      [0],
      [null, undefined, true, false, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(1)", () => {
    const validator = vCompiler(1);
    testValidator(
      validator,
      [1],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test('v("0")', () => {
    const validator = vCompiler("0");
    testValidator(
      validator,
      ["0"],
      [null, undefined, true, false, 0, Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test('v(Symbol.for("quartet"))', () => {
    const validator = vCompiler(Symbol.for("quartet"));
    testValidator(
      validator,
      [Symbol.for("quartet")],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
});
