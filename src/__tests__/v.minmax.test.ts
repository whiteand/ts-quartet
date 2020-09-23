import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v.min, v.max, v.minLength, v.maxLength", () => {
  test("v.min", () => {
    const checkNonNegative = v(v.min(0));
    testValidator(
      checkNonNegative,
      [0, 1, 2, 3.1415926, Infinity, [0], ["0"]],
      [-1, "-1", [-1]]
    );
  });
  test("v.min exclusive", () => {
    const checkPositive = v(v.min(0, true));
    testValidator(
      checkPositive,
      [1, 2, 3.1415926, Infinity, [1], "1", ["1"]],
      [0, -1, "-1", [-1], [0], ["0"]]
    );
  });
  test("v.max", () => {
    const checkNonPositive = v(v.max(0));
    testValidator(
      checkNonPositive,
      [0, -1, -2, -3.1415926, -Infinity, [0], ["0"]],
      [1, "1", [1]]
    );
  });
  test("v.max exclusive", () => {
    const checkNegative = v(v.max(0, true));
    testValidator(
      checkNegative,
      [-1, -2, -3.1415926, -Infinity, [-1], "-1", ["-1"]],
      [0, 1, "1", [0], ["0"]]
    );
  });
  test("v.minLength", () => {
    const validator = v(v.minLength(2));
    testValidator(
      validator,
      ["ab", [1, 2], { length: 3 }],
      ["a", [1], {}, null, undefined, false, true]
    );
  });
  test("v.minLength exclusive", () => {
    const checkPositive = v(v.minLength(2, true));
    testValidator(
      checkPositive,
      ["abc", [1, 2, 3], { length: 3 }],
      ["ab", [1, 2], "a", [1], {}, null, undefined, false, true]
    );
  });
  test("v.maxLength", () => {
    const checkNonPositive = v(v.maxLength(2));
    testValidator(
      checkNonPositive,
      ["ab", [1, 2], "a", [1]],
      ["abc", [1, 2, 3], { length: 3 }, {}, null, undefined, false, true]
    );
  });
  test("v.maxLength exclusive", () => {
    const validator = v(v.maxLength(2, true));
    testValidator(
      validator,
      ["a", [1]],
      ["ab", [1, 2], { length: 3 }, {}, null, undefined, false, true]
    );
  });
});
