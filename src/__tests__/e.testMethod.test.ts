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
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: "A"
      }
    ]);
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: []
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, 1)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: 1
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, NaN)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: true
      }
    ]);
  });
  test("{ a: v.test }", () => {
    const tester = /^a/;
    const validator = v({ a: v.test(tester) });
    testValidatorImpure(
      validator,
      ["a", "andrew"].map(a => ({ a })),
      ["A", null, false, [], {}, 1, 0, NaN, undefined, true].map(a => ({ a }))
    );
    expect(getExplanations(validator, { a: "A" })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: "A"
      }
    ]);
    expect(getExplanations(validator, { a: false })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, { a: [] })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: []
      }
    ]);
    expect(getExplanations(validator, { a: {} })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, { a: 1 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: 1
      }
    ]);
    expect(getExplanations(validator, { a: 0 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, { a: NaN })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, { a: true })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          description: "/^a/",
          type: ExplanationSchemaType.Test
        },
        value: true
      }
    ]);
  });
});
