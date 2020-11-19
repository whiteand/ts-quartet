import { e as v, ExplanationSchemaType } from "..";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v(primitive)", () => {
  test("v(null)", () => {
    const validator = v<null>(null);
    testValidatorImpure(
      validator,
      [null],
      [undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: undefined,
      },
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: true,
      },
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: false,
      },
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: 0,
      },
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: "0",
      },
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: NaN,
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: {},
      },
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: null,
        value: [],
      },
    ]);
  });
  test("v(undefined)", () => {
    const validator = v(undefined);
    testValidatorImpure(
      validator,
      [undefined],
      [null, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: null,
      },
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: true,
      },
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: false,
      },
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: 0,
      },
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: "0",
      },
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: NaN,
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: {},
      },
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: undefined,
        value: [],
      },
    ]);
  });
  test("v(true)", () => {
    const validator = v(true);
    testValidatorImpure(
      validator,
      [true],
      [null, undefined, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: null,
      },
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: undefined,
      },
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: false,
      },
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: 0,
      },
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: "0",
      },
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: NaN,
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: {},
      },
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: true,
        value: [],
      },
    ]);
  });
  test("v(false)", () => {
    const validator = v(false);
    testValidatorImpure(
      validator,
      [false],
      [null, undefined, true, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: null,
      },
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: undefined,
      },
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: true,
      },
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: 0,
      },
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: "0",
      },
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: NaN,
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: {},
      },
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: false,
        value: [],
      },
    ]);
  });
  test("v(NaN)", () => {
    const validator = v(NaN);
    testValidatorImpure(
      validator,
      [NaN],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, {}, []]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: null,
      },
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: true,
      },
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: false,
      },
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: 0,
      },
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: "0",
      },
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: {},
      },
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: [],
      },
    ]);
  });
  test("v({ a :NaN })", () => {
    const validator = v({ a: NaN });
    testValidatorImpure(
      validator,
      [{ a: NaN }],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, {}, []].map(
        (a) => ({
          a,
        })
      )
    );
    expect(getExplanations(validator, { a: null })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: null,
      },
    ]);
    expect(getExplanations(validator, { a: undefined })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: undefined,
      },
    ]);
    expect(getExplanations(validator, { a: true })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: true,
      },
    ]);
    expect(getExplanations(validator, { a: false })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: false,
      },
    ]);
    expect(getExplanations(validator, { a: 0 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: 0,
      },
    ]);
    expect(getExplanations(validator, { a: "0" })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: "0",
      },
    ]);
    expect(getExplanations(validator, { a: Infinity })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, { a: -Infinity })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, { a: {} })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: {},
      },
    ]);
    expect(getExplanations(validator, { a: [] })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.NotANumber,
        },
        value: [],
      },
    ]);
  });
  test("v(0)", () => {
    const validator = v(0);
    testValidatorImpure(
      validator,
      [0],
      [null, undefined, true, false, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: null,
      },
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: undefined,
      },
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: true,
      },
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: false,
      },
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: "0",
      },
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: NaN,
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: {},
      },
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 0,
        value: [],
      },
    ]);
  });
  test("v(1)", () => {
    const validator = v(1);
    testValidatorImpure(
      validator,
      [1],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: null,
      },
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: undefined,
      },
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: true,
      },
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: false,
      },
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: 0,
      },
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: "0",
      },
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: NaN,
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: {},
      },
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: 1,
        value: [],
      },
    ]);
  });
  test('v("0")', () => {
    const validator = v("0");
    testValidatorImpure(
      validator,
      ["0"],
      [null, undefined, true, false, 0, Infinity, -Infinity, 0 / 0, {}, []]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: null,
      },
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: undefined,
      },
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: true,
      },
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: false,
      },
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: 0,
      },
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: NaN,
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: {},
      },
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: "0",
        value: [],
      },
    ]);
  });
  test('v(Symbol.for("quartet"))', () => {
    const validator = v(Symbol.for("quartet"));
    testValidatorImpure(
      validator,
      [Symbol.for("quartet")],
      [null, undefined, true, false, 0, "0", Infinity, -Infinity, 0 / 0, {}, []]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: null,
      },
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: undefined,
      },
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: true,
      },
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: false,
      },
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: 0,
      },
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: "0",
      },
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: Infinity,
      },
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: -Infinity,
      },
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: NaN,
      },
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: {},
      },
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: Symbol.for("quartet"),
        value: [],
      },
    ]);
  });
});
