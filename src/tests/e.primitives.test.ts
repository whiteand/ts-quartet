import { e as v } from "..";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v(primitive)", () => {
  test("v(null)", () => {
    const validator = v<null>(null);
    testValidatorImpure(
      validator,
      [null],
      [undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(undefined)", () => {
    const validator = v(undefined);
    testValidatorImpure(
      validator,
      [undefined],
      [null, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(true)", () => {
    const validator = v(true);
    testValidatorImpure(
      validator,
      [true],
      [null, undefined, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(false)", () => {
    const validator = v(false);
    testValidatorImpure(
      validator,
      [false],
      [null, undefined, true, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(NaN)", () => {
    const validator = v(NaN);
    testValidatorImpure(
      validator,
      [NaN],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, {}, []]
    );
  });
  test("v(0)", () => {
    const validator = v(0);
    testValidatorImpure(
      validator,
      [0],
      [null, undefined, true, false, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(1)", () => {
    const validator = v(1);
    testValidatorImpure(
      validator,
      [1],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test('v("0")', () => {
    const validator = v("0");
    testValidatorImpure(
      validator,
      ["0"],
      [null, undefined, true, false, 0, Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test('v(Symbol.for("quartet"))', () => {
    const validator = v(Symbol.for("quartet"));
    testValidatorImpure(
      validator,
      [Symbol.for("quartet")],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
});
