import { e as v, Z } from "..";
import { ExplanationSchemaType } from "../explanations";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";
import { testValidatorWithExplanations } from "./testValidatorWithExplanations";
import { describe, expect } from "vitest";

describe("v.arrayOf", (test) => {
  test("v.arrayOf(v.number)", () => {
    const validator = v(v.arrayOf(v.number));
    testValidatorWithExplanations(validator, [[], [1, NaN, 2]], []);
    expect(getExplanations(validator, [1, 2, "3"])).toEqual([
      {
        path: [2],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: "3",
      },
    ]);
    expect(getExplanations(validator, ["3"])).toEqual([
      {
        path: [0],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: "3",
      },
    ]);
    expect(getExplanations(validator, [[1]])).toEqual([
      {
        path: [0],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: [1],
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            type: ExplanationSchemaType.Number,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: {},
      },
    ]);
    expect(getExplanations(validator, { length: 10 })).toEqual([
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
          length: 10,
        },
      },
    ]);
    expect(getExplanations(validator, "Andrew")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            type: ExplanationSchemaType.Number,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: "Andrew",
      },
    ]);
  });
  test("{ a: v.arrayOf(v.number) }", () => {
    const validator = v({ a: v.arrayOf(v.number) });
    testValidatorWithExplanations(
      validator,
      [[], [1, NaN, 2]].map((a) => ({ a })),
      []
    );
    expect(getExplanations(validator, { a: [1, 2, "3"] })).toEqual([
      {
        path: ["a", 2],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: "3",
      },
    ]);
    expect(getExplanations(validator, { a: ["3"] })).toEqual([
      {
        path: ["a", 0],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: "3",
      },
    ]);
    expect(getExplanations(validator, { a: [[1]] })).toEqual([
      {
        path: ["a", 0],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: [1],
      },
    ]);
    expect(getExplanations(validator, { a: {} })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          elementSchema: {
            type: ExplanationSchemaType.Number,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: {},
      },
    ]);
    expect(getExplanations(validator, { a: { length: 10 } })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          elementSchema: {
            type: ExplanationSchemaType.Number,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: {
          length: 10,
        },
      },
    ]);
    expect(getExplanations(validator, { a: "Andrew" })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          elementSchema: {
            type: ExplanationSchemaType.Number,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: "Andrew",
      },
    ]);
  });
  test("v.arrayOf(v.pair)", () => {
    const customValidator = ({ key, value }: { key: number; value: Z }) => {
      return value === key * key;
    };
    const checkSquares = v(v.arrayOf(v.pair(v.custom(customValidator))));
    testValidatorImpure(
      checkSquares,
      [[], [0, 1], [0, 1, 4]],
      [[1], [0, 2], [1, 2, "3"], ["3"], [[1]], {}, { length: 10 }, "Andrew"]
    );
    expect(getExplanations(checkSquares, [1])).toEqual([
      {
        path: [0],
        innerExplanations: [],
        schema: {
          description: "customValidator",
          innerExplanations: [],
          type: ExplanationSchemaType.Custom,
        },
        value: {
          key: 0,
          value: 1,
        },
      },
    ]);
    expect(getExplanations(checkSquares, [0, 2])).toEqual([
      {
        path: [1],
        innerExplanations: [],
        schema: {
          description: "customValidator",
          innerExplanations: [],
          type: ExplanationSchemaType.Custom,
        },
        value: {
          key: 1,
          value: 2,
        },
      },
    ]);
    expect(getExplanations(checkSquares, [1, 2, "3"])).toEqual([
      {
        path: [0],
        innerExplanations: [],
        schema: {
          description: "customValidator",
          innerExplanations: [],
          type: ExplanationSchemaType.Custom,
        },
        value: {
          key: 0,
          value: 1,
        },
      },
    ]);
    expect(getExplanations(checkSquares, ["3"])).toEqual([
      {
        path: [0],
        innerExplanations: [],
        schema: {
          description: "customValidator",
          innerExplanations: [],
          type: ExplanationSchemaType.Custom,
        },
        value: {
          key: 0,
          value: "3",
        },
      },
    ]);
    expect(getExplanations(checkSquares, [[1]])).toEqual([
      {
        path: [0],
        innerExplanations: [],
        schema: {
          description: "customValidator",
          innerExplanations: [],
          type: ExplanationSchemaType.Custom,
        },
        value: {
          key: 0,
          value: [1],
        },
      },
    ]);
    expect(getExplanations(checkSquares, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            keyValueSchema: {
              description: "customValidator",
              innerExplanations: [],
              type: ExplanationSchemaType.Custom,
            },
            type: ExplanationSchemaType.Pair,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: {},
      },
    ]);
    expect(getExplanations(checkSquares, { length: 10 })).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            keyValueSchema: {
              description: "customValidator",
              innerExplanations: [],
              type: ExplanationSchemaType.Custom,
            },
            type: ExplanationSchemaType.Pair,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: {
          length: 10,
        },
      },
    ]);
    expect(getExplanations(checkSquares, "Andrew")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            keyValueSchema: {
              description: "customValidator",
              innerExplanations: [],
              type: ExplanationSchemaType.Custom,
            },
            type: ExplanationSchemaType.Pair,
          },
          type: ExplanationSchemaType.ArrayOf,
        },
        value: "Andrew",
      },
    ]);
  });
  test("stops on first invalid", () => {
    const arr: Z[] = [1, 2, 3, "4", 5, 6];
    const checked: Z[] = [];
    const checkArr = v(
      v.arrayOf(
        v.and(
          v.custom((value) => {
            checked.push(value);
            return true;
          }),
          v.number
        )
      )
    );
    expect(checkArr(arr)).toBe(false);
    expect(checked).toEqual([1, 2, 3, "4"]);
  });
});
