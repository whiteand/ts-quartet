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
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: true
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: "0"
      }
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: null
        },
        value: []
      }
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
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: true
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: "0"
      }
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: undefined
        },
        value: []
      }
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
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: "0"
      }
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: true
        },
        value: []
      }
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
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: true
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: "0"
      }
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: false
        },
        value: []
      }
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
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: true
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: "0"
      }
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.NotANumber
        },
        value: []
      }
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
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: true
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: "0"
      }
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 0
        },
        value: []
      }
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
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: true
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: "0"
      }
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: []
      }
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
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: true
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: "0"
        },
        value: []
      }
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
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: true
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, "0")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: "0"
      }
    ]);
    expect(getExplanations(validator, Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(validator, -Infinity)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(validator, 0 / 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: Symbol.for("quartet")
        },
        value: []
      }
    ]);
  });
});
