import { describe } from "vitest";
import { e } from "../e";
import { ExplanationSchemaType } from "../explanations/types";
import { testValidatorWithExplanations } from "./testValidatorWithExplanations";

describe("e.any", (test) => {
  test("e.any", () => {
    testValidatorWithExplanations(
      e(e.any),
      [null, false, [], {}, 1, 0, NaN, undefined, true],
      []
    );
  });
  test("{ a: e.any }", () => {
    testValidatorWithExplanations(
      e({ a: e.any }),
      [null, false, [], {}, 1, 0, NaN, undefined, true].map((a) => ({ a })),
      [
        [
          null,
          [
            {
              innerExplanations: [],
              path: [],
              schema: {
                propsSchemas: {
                  a: {
                    type: ExplanationSchemaType.Any,
                  },
                },
                type: ExplanationSchemaType.Object,
              },
              value: null,
            },
          ],
        ],
        [
          undefined,
          [
            {
              innerExplanations: [],
              path: [],
              schema: {
                propsSchemas: {
                  a: {
                    type: ExplanationSchemaType.Any,
                  },
                },
                type: ExplanationSchemaType.Object,
              },
              value: undefined,
            },
          ],
        ],
      ]
    );
  });
});
