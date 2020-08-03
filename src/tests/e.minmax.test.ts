import { e as v } from "../e";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.min, v.max, v.minLength, v.maxLength", () => {
  test("v.min", () => {
    const checkNonNegative = v(v.min(0));
    testValidatorImpure(
      checkNonNegative,
      [0, 1, 2, 3.1415926, Infinity, [0], ["0"]],
      [-1, "-1", [-1]]
    );
  });
  test("v.min exclusive", () => {
    const checkPositive = v(v.min(0, true));
    testValidatorImpure(
      checkPositive,
      [1, 2, 3.1415926, Infinity, [1], "1", ["1"]],
      [0, -1, "-1", [-1], [0], ["0"]]
    );
  });
  test("v.max", () => {
    const checkNonPositive = v(v.max(0));
    testValidatorImpure(
      checkNonPositive,
      [0, -1, -2, -3.1415926, -Infinity, [0], ["0"]],
      [1, "1", [1]]
    );
  });
  test("v.max exclusive", () => {
    const checkNegative = v(v.max(0, true));
    testValidatorImpure(
      checkNegative,
      [-1, -2, -3.1415926, -Infinity, [-1], "-1", ["-1"]],
      [0, 1, "1", [0], ["0"]]
    );
  });
  test("v.minLength", () => {
    const validator = v(v.minLength(2));
    testValidatorImpure(
      validator,
      ["ab", [1, 2], { length: 3 }],
      ["a", [1], {}, null, undefined, false, true]
    );
  });
  test("v.minLength exclusive", () => {
    const checkPositive = v(v.minLength(2, true));
    testValidatorImpure(
      checkPositive,
      ["abc", [1, 2, 3], { length: 3 }],
      ["ab", [1, 2], "a", [1], {}, null, undefined, false, true]
    );
  });
  test("v.maxLength", () => {
    const checkNonPositive = v(v.maxLength(2));
    testValidatorImpure(
      checkNonPositive,
      ["ab", [1, 2], "a", [1]],
      ["abc", [1, 2, 3], { length: 3 }, {}, null, undefined, false, true]
    );
  });
  test("v.maxLength exclusive", () => {
    const validator = v(v.maxLength(2, true));
    testValidatorImpure(
      validator,
      ["a", [1]],
      ["ab", [1, 2], { length: 3 }, {}, null, undefined, false, true]
    );
  });
});
