/* tslint:disable:object-literal-sort-keys */
import { e as v } from "..";
import { ExplanationSchemaType } from "../explanations";
import { testValidatorWithExplanations } from "./testValidatorWithExplanations";

describe("v.array", () => {
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
              schema: {
                type: ExplanationSchemaType.Array
              }
            }
          ]
        ],
        [
          { length: 10 },
          [
            {
              value: { length: 10 },
              path: [],
              schema: {
                type: ExplanationSchemaType.Array
              }
            }
          ]
        ],
        [
          "Andrew",
          [
            {
              value: "Andrew",
              path: [],
              schema: {
                type: ExplanationSchemaType.Array
              }
            }
          ]
        ]
      ]
    );
  });
});
