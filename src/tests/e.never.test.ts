import { e as v } from "..";
import { testValidatorWithExplanations } from "./testValidatorWithExplanations";
import { ExplanationSchemaType } from "../explanations";

describe("v.never", () => {
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
            },
          ],
        ],
      ]
    );
  });
});
