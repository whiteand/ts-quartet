import { e, ExplanationSchemaType, Z } from "..";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";
import { describe, expect } from "vitest";

describe("e.custom", (test) => {
  test("e(e.arrayOf(e.custom(e(e.number))))", () => {
    const checkNumber = e(e.number);
    const checkArrNumber = e(
      e.arrayOf(e.custom(checkNumber, "should be number"))
    );
    testValidatorImpure(
      checkArrNumber,
      [[], [1], [1, 2, 3]],
      [null, false, { length: 1, 0: 1 }, ["1"]]
    );
    expect(getExplanations(checkArrNumber, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            description: "should be number",
            innerExplanations: [
              {
                path: [],
                innerExplanations: [],
                schema: {
                  type: ExplanationSchemaType.Number,
                },
                value: "1",
              },
            ],
            type: ExplanationSchemaType.Custom,
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
            description: `should be number`,
            innerExplanations: [
              {
                path: [],
                innerExplanations: [],
                schema: {
                  type: ExplanationSchemaType.Number,
                },
                value: "1",
              },
            ],
            type: ExplanationSchemaType.Custom,
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
            description: "should be number",
            innerExplanations: [
              {
                path: [],
                innerExplanations: [],
                schema: {
                  type: ExplanationSchemaType.Number,
                },
                value: "1",
              },
            ],
            type: ExplanationSchemaType.Custom,
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
          description: "should be number",
          innerExplanations: [
            {
              path: [],
              innerExplanations: [],
              schema: {
                type: ExplanationSchemaType.Number,
              },
              value: "1",
            },
          ],
          type: ExplanationSchemaType.Custom,
        },
        value: "1",
      },
    ]);
  });
  test('e(e.arrayOf(e.custom(x => typeof x === "number")))', () => {
    const checkNumber = (x: Z) => typeof x === "number";
    const checkArrNumber = e(e.arrayOf(e.custom(checkNumber)));
    testValidatorImpure(
      checkArrNumber,
      [[], [1], [1, 2, 3]],
      [null, false, { length: 1, 0: 1 }, ["1"]]
    );
    expect(getExplanations(checkArrNumber, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          elementSchema: {
            description: "checkNumber",
            innerExplanations: [],
            type: ExplanationSchemaType.Custom,
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
            description: "checkNumber",
            innerExplanations: [],
            type: ExplanationSchemaType.Custom,
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
            description: "checkNumber",
            innerExplanations: [],
            type: ExplanationSchemaType.Custom,
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
          description: "checkNumber",
          innerExplanations: [],
          type: ExplanationSchemaType.Custom,
        },
        value: "1",
      },
    ]);
  });
  test("it has proper description", () => {
    const check = e(e.custom((x) => x === 42, "not 42"));
    expect(check(42)).toBe(true);
    expect(check(41)).toBe(false);
    expect(check.explanations).toMatchInlineSnapshot(`
      [
        {
          "innerExplanations": [],
          "path": [],
          "schema": {
            "description": "not 42",
            "innerExplanations": [],
            "type": "Custom",
          },
          "value": 41,
        },
      ]
    `);
  });
});
