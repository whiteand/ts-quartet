import { e as v, ExplanationSchemaType } from "..";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.not", () => {
  test("v.not", () => {
    const validator = v(v.not(false));
    testValidatorImpure(
      validator,
      [null, [], {}, 1, 0, NaN, undefined, true],
      [false]
    );

    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          schema: {
            type: ExplanationSchemaType.Primitive,
            value: false
          },
          type: ExplanationSchemaType.Not
        },
        value: false,
        innerExplanations: []
      }
    ]);
  });
});
