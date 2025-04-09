/* tslint:disable:object-literal-sort-keys */
import { e as v } from "..";
import { ExplanationSchemaType } from "../explanations";
import { testValidatorWithExplanations } from "./testValidatorWithExplanations";
import { describe } from "vitest";

describe("v.never", (test) => {
  test("v.never", () => {
    testValidatorWithExplanations(
      v(v.never),
      [],
      [
        [
          null,
          [
            {
              value: null,
              schema: { type: ExplanationSchemaType.Never },
              path: [],
              innerExplanations: [],
            },
          ],
        ],
        [
          false,
          [
            {
              value: false,
              schema: { type: ExplanationSchemaType.Never },
              path: [],
              innerExplanations: [],
            },
          ],
        ],
        [
          [],
          [
            {
              value: [],
              schema: { type: ExplanationSchemaType.Never },
              path: [],
              innerExplanations: [],
            },
          ],
        ],
        [
          {},
          [
            {
              value: {},
              schema: { type: ExplanationSchemaType.Never },
              path: [],
              innerExplanations: [],
            },
          ],
        ],
        [
          1,
          [
            {
              value: 1,
              schema: { type: ExplanationSchemaType.Never },
              path: [],
              innerExplanations: [],
            },
          ],
        ],
        [
          0,
          [
            {
              value: 0,
              schema: { type: ExplanationSchemaType.Never },
              path: [],
              innerExplanations: [],
            },
          ],
        ],
        [
          NaN,
          [
            {
              value: NaN,
              schema: { type: ExplanationSchemaType.Never },
              path: [],
              innerExplanations: [],
            },
          ],
        ],
        [
          undefined,
          [
            {
              value: undefined,
              schema: { type: ExplanationSchemaType.Never },
              path: [],
              innerExplanations: [],
            },
          ],
        ],
      ],
    );
  });
});
