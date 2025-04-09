import { e, ExplanationSchemaType } from "..";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";
import { describe, expect } from "vitest";

describe("e.inline", (test) => {
  test("e(e.arrayOf(e(e.number)))", () => {
    const checkNumber = e(e.number);
    const checkArrNumber = e(e.arrayOf(checkNumber));
    testValidatorImpure(
      checkArrNumber,
      [[], [1], [1, 2, 3]],
      [null, false, { length: 1, 0: 1 }, ["1"]],
    );
    expect(getExplanations(checkArrNumber, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            type: ExplanationSchemaType.Number,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: null,
      },
    ]);
    expect(getExplanations(checkArrNumber, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            type: ExplanationSchemaType.Number,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: false,
      },
    ]);
    expect(getExplanations(checkArrNumber, { length: 1, 0: 1 })).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            type: ExplanationSchemaType.Number,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: {
          "0": 1,
          length: 1,
        },
      },
    ]);
    expect(getExplanations(checkArrNumber, ["1"])).toEqual([
      {
        path: [0],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: "1",
      },
    ]);
  });
});
