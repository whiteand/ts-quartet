import { e as v, ExplanationSchemaType, Z } from "..";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v({ ... })", () => {
  test("v({})", () => {
    const notNull = v({});
    testValidatorImpure(
      notNull,
      [{}, 1, 0, false, true, "", []],
      [null, undefined]
    );
    expect(getExplanations(notNull, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: null,
      },
    ]);
    expect(getExplanations(notNull, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: undefined,
      },
    ]);
  });
  test("v({ a: number })", () => {
    const notNull = v({ a: v.number });
    testValidatorImpure(
      notNull,
      [{ a: NaN }, { a: Infinity }, { a: 1, b: "123" }],
      [null, undefined, {}, 1, 0, false, true, "", []]
    );
    expect(getExplanations(notNull, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {
            a: {
              type: ExplanationSchemaType.Number,
            },
          },
          type: ExplanationSchemaType.Object,
        },
        value: null,
      },
    ]);
    expect(getExplanations(notNull, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {
            a: {
              type: ExplanationSchemaType.Number,
            },
          },
          type: ExplanationSchemaType.Object,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, {})).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, 1)).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, 0)).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, false)).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, true)).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, "")).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, [])).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
  });
  test('v({ a: number, [restOmit]: ["valid"] })', () => {
    const notNull = v({ a: v.number, [v.restOmit]: ["valid"] });
    testValidatorImpure(
      notNull,
      [{ a: NaN }, { a: Infinity }, { a: 1 }],
      [null, undefined, {}, 1, 0, false, true, "", []]
    );
    expect(getExplanations(notNull, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {
            a: {
              type: ExplanationSchemaType.Number,
            },
          },
          type: ExplanationSchemaType.Object,
        },
        value: null,
      },
    ]);
    expect(getExplanations(notNull, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {
            a: {
              type: ExplanationSchemaType.Number,
            },
          },
          type: ExplanationSchemaType.Object,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, {})).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, 1)).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, 0)).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, false)).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, true)).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, "")).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, [])).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: undefined,
      },
    ]);
  });
  test("v({ [restOmit]: something })", () => {
    const notNull = v({
      [v.restOmit]: ["andrew"],
    });
    testValidatorImpure(
      notNull,
      [{}, 1, 0, false, true, "", []],
      [null, undefined]
    );
    expect(getExplanations(notNull, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: null,
      },
    ]);
    expect(getExplanations(notNull, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: undefined,
      },
    ]);
  });
  test("v({ [rest]: number })", () => {
    const notNull = v({
      [v.rest]: v.number,
    });
    testValidatorImpure(
      notNull,
      [{}, 1, 0, false, true, "", [], { a: 1 }],
      [{ b: "string" }, null, undefined]
    );
    expect(getExplanations(notNull, { b: "string" })).toEqual([
      {
        path: ["b"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: "string",
      },
    ]);
    expect(getExplanations(notNull, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          "[v.restOmit]": [],
          "[v.rest]": {
            type: ExplanationSchemaType.Number,
          },
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: null,
      },
    ]);
    expect(getExplanations(notNull, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          "[v.restOmit]": [],
          "[v.rest]": {
            type: ExplanationSchemaType.Number,
          },
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: undefined,
      },
    ]);
  });

  test('v({ [rest]: number, [restOmit]: ["valid"] })', () => {
    const notNull = v({
      [v.rest]: v.number,
      [v.restOmit]: ["valid"],
    });
    testValidatorImpure(
      notNull,
      [
        {},
        1,
        0,
        false,
        true,
        "",
        [],
        { a: 1 },
        { a: 1, valid: null },
        { valid: null },
      ],
      [{ b: "string" }, null, undefined]
    );
    expect(getExplanations(notNull, { b: "string" })).toEqual([
      {
        path: ["b"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: "string",
      },
    ]);
    expect(getExplanations(notNull, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          "[v.restOmit]": ["valid"],
          "[v.rest]": {
            type: ExplanationSchemaType.Number,
          },
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: null,
      },
    ]);
    expect(getExplanations(notNull, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          "[v.restOmit]": ["valid"],
          "[v.rest]": {
            type: ExplanationSchemaType.Number,
          },
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: undefined,
      },
    ]);
  });
  test("v({ a: string, [rest]: number })", () => {
    const notNull = v({
      a: v.string,
      [v.rest]: v.number,
    });
    testValidatorImpure(
      notNull,
      [{ a: "" }, { a: "1" }, { a: "1", b: 1 }],
      [
        { b: "string" },
        null,
        undefined,
        { a: 1 },
        {},
        [],
        { a: null },
        { a: "1", b: "1" },
      ]
    );
    expect(getExplanations(notNull, { b: "string" })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          "[v.restOmit]": [],
          "[v.rest]": {
            type: ExplanationSchemaType.Number,
          },
          propsSchemas: {
            a: {
              type: ExplanationSchemaType.String,
            },
          },
          type: ExplanationSchemaType.Object,
        },
        value: null,
      },
    ]);
    expect(getExplanations(notNull, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          "[v.restOmit]": [],
          "[v.rest]": {
            type: ExplanationSchemaType.Number,
          },
          propsSchemas: {
            a: {
              type: ExplanationSchemaType.String,
            },
          },
          type: ExplanationSchemaType.Object,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, { a: 1 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: 1,
      },
    ]);
    expect(getExplanations(notNull, {})).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, [])).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, { a: null })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: null,
      },
    ]);
    expect(getExplanations(notNull, { a: "1", b: "1" })).toEqual([
      {
        path: ["b"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number,
        },
        value: "1",
      },
    ]);
  });
  test('v({ [rest]: number, a: string, [restOmit]: ["b"] })', () => {
    const notNull = v({
      a: v.string,
      [v.rest]: v.number,
      [v.restOmit]: ["b"],
    });
    testValidatorImpure(
      notNull,
      [
        { a: "" },
        { a: "1" },
        { a: "1", b: 1 },
        { a: "1", b: 1, c: 2 },
        { a: "1", b: null },
        { a: "1", b: 2 },
      ],
      [{ b: "string" }, null, undefined, { a: 1 }, {}, [], { a: null }]
    );
    expect(getExplanations(notNull, { b: "string" })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          "[v.restOmit]": ["b"],
          "[v.rest]": {
            type: ExplanationSchemaType.Number,
          },
          propsSchemas: {
            a: {
              type: ExplanationSchemaType.String,
            },
          },
          type: ExplanationSchemaType.Object,
        },
        value: null,
      },
    ]);
    expect(getExplanations(notNull, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          "[v.restOmit]": ["b"],
          "[v.rest]": {
            type: ExplanationSchemaType.Number,
          },
          propsSchemas: {
            a: {
              type: ExplanationSchemaType.String,
            },
          },
          type: ExplanationSchemaType.Object,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, { a: 1 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: 1,
      },
    ]);
    expect(getExplanations(notNull, {})).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, [])).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(notNull, { a: null })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String,
        },
        value: null,
      },
    ]);
  });
  test("{ v.pair }", () => {
    let pairFromValidator: Z | null = null;
    const checkDict = v({
      [v.rest]: v.pair(
        v.custom((pair) => {
          pairFromValidator = pair;
          return true;
        })
      ),
    });
    expect(
      checkDict({
        a: 123,
      })
    ).toBe(true);
    expect(pairFromValidator).toEqual({ key: "a", value: 123 });
  });
  test("{ v.pair }", () => {
    let pairFromValidator: Z | null = null;
    const checkDict = v({
      a: v.pair(
        v.custom((pair) => {
          pairFromValidator = pair;
          return true;
        })
      ),
    });
    expect(
      checkDict({
        a: 123,
      })
    ).toBe(true);
    expect(pairFromValidator).toEqual({ key: "a", value: 123 });
  });
  test("symbol prop", () => {
    const checkQuartet = v({
      [Symbol.for("quartet")]: v.number,
    });
    testValidatorImpure(
      checkQuartet,
      [
        { [Symbol.for("quartet")]: 1 },
        { [Symbol.for("quartet")]: "1" },
        {},
        0,
        1,
        false,
        true,
      ],
      [null, undefined]
    );
    expect(getExplanations(checkQuartet, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: null,
      },
    ]);
    expect(getExplanations(checkQuartet, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          propsSchemas: {},
          type: ExplanationSchemaType.Object,
        },
        value: undefined,
      },
    ]);
  });
  test("for readme", () => {
    const checkPerson = v({
      name: v.string,
    });
    expect(checkPerson({ name: 1 })).toBe(false); // false
    expect(checkPerson.explanations).toEqual([
      {
        path: ["name"],
        innerExplanations: [],
        schema: {
          type: "String",
        },
        value: 1,
      },
    ]);
  });
  test("nested objects", () => {
    const validator = v({
      p: {
        name: v.string,
      },
    });
    expect(validator({ p: { name: 1 } })).toBe(false); // false
    expect(validator.explanations).toEqual([
      {
        path: ["p", "name"],
        innerExplanations: [],
        schema: {
          type: "String",
        },
        value: 1,
      },
    ]);
  });
});
