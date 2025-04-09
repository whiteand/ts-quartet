import { v } from "../v";
import { testValidator } from "./testValidator";
import { describe } from "vitest";

describe("v.min, v.max, v.minLength, v.maxLength", (test) => {
  test("v.min", () => {
    const checkNonNegative = v(v.min(0));
    testValidator(
      checkNonNegative,
      [0, 1, 2, 3.1415926, Infinity, [0], ["0"]],
      [-1, "-1", [-1]]
    );
  });
  test("{ a: v.min }", () => {
    const checkNonNegative = v({ a: v.min(0) });
    testValidator(
      checkNonNegative,
      [0, 1, 2, 3.1415926, Infinity, [0], ["0"]].map((a) => ({ a })),
      [-1, "-1", [-1]].map((a) => ({ a }))
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
  test("{ a: v.min } exclusive", () => {
    const checkPositive = v({ a: v.min(0, true) });
    testValidator(
      checkPositive,
      [1, 2, 3.1415926, Infinity, [1], "1", ["1"]].map((a) => ({ a })),
      [0, -1, "-1", [-1], [0], ["0"]].map((a) => ({ a }))
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
  test("{a : v.max }", () => {
    const checkNonPositive = v({ a: v.max(0) });
    testValidator(
      checkNonPositive,
      [0, -1, -2, -3.1415926, -Infinity, [0], ["0"]].map((a) => ({ a })),
      [1, "1", [1]].map((a) => ({ a }))
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
  test("{ a: v.max } exclusive", () => {
    const checkNegative = v({ a: v.max(0, true) });
    testValidator(
      checkNegative,
      [-1, -2, -3.1415926, -Infinity, [-1], "-1", ["-1"]].map((a) => ({ a })),
      [0, 1, "1", [0], ["0"]].map((a) => ({ a }))
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
  test("{ a: v.minLength }", () => {
    const validator = v({ a: v.minLength(2) });
    testValidator(
      validator,
      ["ab", [1, 2], { length: 3 }].map((a) => ({ a })),
      [
        "a",
        [1],
        {},
        null,
        undefined,
        false,
        true,
        ...["a", [1], {}, null, undefined, false, true].map((a) => ({ a })),
      ]
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
  test("{ a: v.minLength } exclusive", () => {
    const checkPositive = v({ a: v.minLength(2, true) });
    testValidator(
      checkPositive,
      ["abc", [1, 2, 3], { length: 3 }].map((a) => ({ a })),
      [
        "ab",
        [1, 2],
        "a",
        [1],
        {},
        null,
        undefined,
        false,
        true,
        ...["ab", [1, 2], "a", [1], {}, null, undefined, false, true].map(
          (a) => ({ a })
        ),
      ]
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
  test("{ a: v.maxLength }", () => {
    const checkNonPositive = v({ a: v.maxLength(2) });
    testValidator(
      checkNonPositive,
      ["ab", [1, 2], "a", [1]].map((a) => ({ a })),
      [
        null,
        undefined,
        ...[
          "abc",
          [1, 2, 3],
          { length: 3 },
          {},
          null,
          undefined,
          false,
          true,
        ].map((a) => ({
          a,
        })),
      ]
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
  test("{ a: v.maxLength } exclusive", () => {
    const validator = v({ a: v.maxLength(2, true) });
    testValidator(
      validator,
      [{ a: "a" }, { a: [1] }],
      ["ab", [1, 2], { length: 3 }, {}, null, undefined, false, true].map(
        (a) => ({ a })
      )
    );
  });
});
