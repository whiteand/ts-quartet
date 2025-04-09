/* tslint:disable:object-literal-sort-keys */
import { describe } from "vitest";
import { e as v } from "..";
import { ExplanationSchemaType } from "../explanations";
import { testValidatorWithExplanations } from "./testValidatorWithExplanations";

describe("v.array", (test) => {
  test("v.array", () => {
    testValidatorWithExplanations(
      v(v.array),
      [[], [1, 2, "3"]],
      [
        [
          {},
          [
            {
              value: {},
              path: [],
              innerExplanations: [],
              schema: {
                type: ExplanationSchemaType.Array,
              },
            },
          ],
        ],
        [
          { length: 10 },
          [
            {
              value: { length: 10 },
              path: [],
              innerExplanations: [],
              schema: {
                type: ExplanationSchemaType.Array,
              },
            },
          ],
        ],
        [
          "Andrew",
          [
            {
              value: "Andrew",
              path: [],
              innerExplanations: [],
              schema: {
                type: ExplanationSchemaType.Array,
              },
            },
          ],
        ],
      ]
    );
  });
  test("{ a: v.array }", () => {
    testValidatorWithExplanations(
      v({ a: v.array }),
      [[], [1, 2, "3"]].map((a) => ({ a })),
      [
        [
          { a: {} },
          [
            {
              value: {},
              path: ["a"],
              innerExplanations: [],
              schema: {
                type: ExplanationSchemaType.Array,
              },
            },
          ],
        ],
        [
          { a: { length: 10 } },
          [
            {
              value: { length: 10 },
              path: ["a"],
              innerExplanations: [],
              schema: {
                type: ExplanationSchemaType.Array,
              },
            },
          ],
        ],
        [
          { a: "Andrew" },
          [
            {
              value: "Andrew",
              path: ["a"],
              innerExplanations: [],
              schema: {
                type: ExplanationSchemaType.Array,
              },
            },
          ],
        ],
      ]
    );
  });
});
