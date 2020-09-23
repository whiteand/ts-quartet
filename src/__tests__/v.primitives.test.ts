import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v(primitive)", () => {
  test("v(null)", () => {
    const validator = v<null>(null);
    testValidator(
      validator,
      [null],
      [undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(undefined)", () => {
    const validator = v(undefined);
    testValidator(
      validator,
      [undefined],
      [null, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(true)", () => {
    const validator = v(true);
    testValidator(
      validator,
      [true],
      [null, undefined, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(false)", () => {
    const validator = v(false);
    testValidator(
      validator,
      [false],
      [null, undefined, true, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(NaN)", () => {
    const validator = v(NaN);
    testValidator(
      validator,
      [NaN],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, {}, []]
    );
  });
  test("v(0)", () => {
    const validator = v(0);
    testValidator(
      validator,
      [0],
      [null, undefined, true, false, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test("v(1)", () => {
    const validator = v(1);
    testValidator(
      validator,
      [1],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test('v("0")', () => {
    const validator = v("0");
    testValidator(
      validator,
      ["0"],
      [null, undefined, true, false, 0, Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
  test('v(Symbol.for("quartet"))', () => {
    const validator = v(Symbol.for("quartet"));
    testValidator(
      validator,
      [Symbol.for("quartet")],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
  });
});
