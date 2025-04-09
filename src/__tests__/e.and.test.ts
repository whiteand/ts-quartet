import { e as v } from "..";
import { testValidatorImpure } from "./testValidatorImpure";
import { describe, expect } from "vitest";

describe("v.and(...)", (test) => {
  test("v.and()", () => {
    testValidatorImpure(
      v(v.and()),
      [null, false, [], {}, 1, 0, NaN, undefined, true],
      [],
    );
  });
  test("v.and(v.safeInteger, v.min(1), v.max(5))", () => {
    const checkRating = v(v.and(v.safeInteger, v.min(1), v.max(5)));
    testValidatorImpure(
      checkRating,
      [1, 2, 3, 4, 5],
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        [1],
        ["1"],
        [2],
        ["2"],
        [5],
        ["5"],
        10,
        0,
        NaN,
        Infinity,
        -Infinity,
        1.5,
      ],
    );
  });
  test("v.and(v.safeInteger, v.and(v.min(1), v.max(5)))", () => {
    const checkRating = v(v.and(v.safeInteger, v.and(v.min(1), v.max(5))));
    testValidatorImpure(
      checkRating,
      [1, 2, 3, 4, 5],
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        [1],
        ["1"],
        [2],
        ["2"],
        [5],
        ["5"],
        10,
        0,
        NaN,
        Infinity,
        -Infinity,
        1.5,
      ],
    );
  });
  test("v.and fast path", () => {
    let flag = true;
    const validator = v(
      v.and(
        v.never,
        v.custom(() => {
          flag = false;
          return true;
        }),
      ),
    );
    validator(1);
    expect(flag).toBe(true);
  });
});
