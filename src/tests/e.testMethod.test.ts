import { e as v, ExplanationSchemaType } from "..";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.test", () => {
  test("v.test", () => {
    const tester = /^a/;
    const validator = v(v.test(tester));
    testValidatorImpure(
      validator,
      ["a", "andrew"],
      ["A", null, false, [], {}, 1, 0, NaN, undefined, true]
    );
    expect(getExplanations(validator, "A")).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: "A"
      }
    ]);
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: []
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, 1)).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: 1
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, NaN)).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          tester,
          type: ExplanationSchemaType.Test
        },
        value: true
      }
    ]);
  });
});
