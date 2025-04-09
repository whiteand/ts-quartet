import { e as v, ExplanationSchemaType } from "..";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";
import { describe, expect } from "vitest";

describe("v.not", (test) => {
  test("v.not", () => {
    const validator = v(v.not(false));
    testValidatorImpure(
      validator,
      [null, [], {}, 1, 0, NaN, undefined, true],
      [false],
    );

    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          schema: false,
          type: ExplanationSchemaType.Not,
        },
        value: false,
        innerExplanations: [],
      },
    ]);
  });
});
