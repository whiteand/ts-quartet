import { e as v, ExplanationSchemaType } from "..";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.[type]", () => {
  test("v.boolean", () => {
    const checkBoolean = v(v.boolean);
    testValidatorImpure(checkBoolean, [true, false], ["true", "false", 1, 0]);
    expect(getExplanations(checkBoolean, "1")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Boolean
        },
        value: "1"
      }
    ]);
  });
  test("{ a: v.boolean }", () => {
    const checkBoolean = v({ a: v.boolean });
    testValidatorImpure(
      checkBoolean,
      [true, false].map(a => ({ a })),
      ["true", "false", 1, 0].map(a => ({ a }))
    );
    expect(getExplanations(checkBoolean, { a: "1" })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Boolean
        },
        value: "1"
      }
    ]);
  });
  test("v.number", () => {
    const checkNumber = v(v.number);
    testValidatorImpure(
      checkNumber,
      [1, 0, 1.5, Infinity, -Infinity, -1, NaN],
      [
        "1",
        null,
        undefined,
        {},
        [],
        {
          valueOf() {
            return 1;
          }
        }
      ]
    );
  });
  test("{ a: v.number }", () => {
    const checkNumber = v({ a: v.number });
    testValidatorImpure(
      checkNumber,
      [1, 0, 1.5, Infinity, -Infinity, -1, NaN].map(a => ({ a })),
      [
        "1",
        null,
        undefined,
        {},
        [],
        {
          valueOf() {
            return 1;
          }
        }
      ].map(a => ({ a }))
    );
    expect(getExplanations(checkNumber, { a: "1" })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number
        },
        value: "1"
      }
    ]);
    expect(getExplanations(checkNumber, { a: null })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number
        },
        value: null
      }
    ]);
    expect(getExplanations(checkNumber, { a: undefined })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number
        },
        value: undefined
      }
    ]);
    expect(getExplanations(checkNumber, { a: {} })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number
        },
        value: {}
      }
    ]);
    expect(getExplanations(checkNumber, { a: [] })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Number
        },
        value: []
      }
    ]);
  });
  test("v.string", () => {
    const checkString = v(v.string);
    testValidatorImpure(
      checkString,
      ["1", ""],
      [Symbol.for("quartet"), String, null, 0, undefined, true, false]
    );
    expect(getExplanations(checkString, Symbol.for("quartet"))).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String
        },
        value: Symbol.for("quartet")
      }
    ]);
    expect(getExplanations(checkString, String)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String
        },
        value: String
      }
    ]);
    expect(getExplanations(checkString, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String
        },
        value: null
      }
    ]);
    expect(getExplanations(checkString, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String
        },
        value: 0
      }
    ]);
    expect(getExplanations(checkString, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String
        },
        value: undefined
      }
    ]);
    expect(getExplanations(checkString, true)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String
        },
        value: true
      }
    ]);
    expect(getExplanations(checkString, false)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.String
        },
        value: false
      }
    ]);
  });
  test("v.finite", () => {
    const checkFinite = v(v.finite);
    testValidatorImpure(
      checkFinite,
      [1, 0, 1.5, -1],
      [
        "1",
        Infinity,
        -Infinity,
        NaN,
        null,
        undefined,
        {},
        [],
        {
          valueOf() {
            return 1;
          }
        }
      ]
    );
    expect(getExplanations(checkFinite, "1")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: "1"
      }
    ]);
    expect(getExplanations(checkFinite, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(checkFinite, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(checkFinite, NaN)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: NaN
      }
    ]);
    expect(getExplanations(checkFinite, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: null
      }
    ]);
    expect(getExplanations(checkFinite, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: undefined
      }
    ]);
    expect(getExplanations(checkFinite, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: {}
      }
    ]);
    expect(getExplanations(checkFinite, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: []
      }
    ]);
  });
  test("{ a: v.finite }", () => {
    const checkFinite = v({ a: v.finite });
    testValidatorImpure(
      checkFinite,
      [1, 0, 1.5, -1].map(a => ({ a })),
      [
        "1",
        Infinity,
        -Infinity,
        NaN,
        null,
        undefined,
        {},
        [],
        {
          valueOf() {
            return 1;
          }
        }
      ].map(a => ({ a }))
    );
    expect(getExplanations(checkFinite, { a: "1" })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: "1"
      }
    ]);
    expect(getExplanations(checkFinite, { a: Infinity })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(checkFinite, { a: -Infinity })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(checkFinite, { a: NaN })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: NaN
      }
    ]);
    expect(getExplanations(checkFinite, { a: null })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: null
      }
    ]);
    expect(getExplanations(checkFinite, { a: undefined })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: undefined
      }
    ]);
    expect(getExplanations(checkFinite, { a: {} })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: {}
      }
    ]);
    expect(getExplanations(checkFinite, { a: [] })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Finite
        },
        value: []
      }
    ]);
  });
  test("v.safeInteger", () => {
    const checkSafeInteger = v(v.safeInteger);
    testValidatorImpure(
      checkSafeInteger,
      [1, 0, -1],
      [
        "1",
        1.5,
        Infinity,
        -Infinity,
        NaN,
        null,
        undefined,
        {},
        [],
        {
          valueOf() {
            return 1;
          }
        }
      ]
    );
    expect(getExplanations(checkSafeInteger, "1")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.SafeInteger
        },
        value: "1"
      }
    ]);
    expect(getExplanations(checkSafeInteger, 1.5)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.SafeInteger
        },
        value: 1.5
      }
    ]);
    expect(getExplanations(checkSafeInteger, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.SafeInteger
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(checkSafeInteger, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.SafeInteger
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(checkSafeInteger, NaN)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.SafeInteger
        },
        value: NaN
      }
    ]);
    expect(getExplanations(checkSafeInteger, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.SafeInteger
        },
        value: null
      }
    ]);
    expect(getExplanations(checkSafeInteger, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.SafeInteger
        },
        value: undefined
      }
    ]);
    expect(getExplanations(checkSafeInteger, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.SafeInteger
        },
        value: {}
      }
    ]);
    expect(getExplanations(checkSafeInteger, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.SafeInteger
        },
        value: []
      }
    ]);
  });
  test("v.function", () => {
    const checkFunction = v(v.function);
    testValidatorImpure(
      checkFunction,
      [
        () => true,
        function() {
          return true;
        },
        new Function("return true")
      ],
      [1, null, undefined]
    );
    expect(getExplanations(checkFunction, 1)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Function
        },
        value: 1
      }
    ]);
    expect(getExplanations(checkFunction, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Function
        },
        value: null
      }
    ]);
    expect(getExplanations(checkFunction, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Function
        },
        value: undefined
      }
    ]);
  });
  test("{ a: v.function }", () => {
    const checkFunction = v({ a: v.function });
    testValidatorImpure(
      checkFunction,
      [
        () => true,
        function() {
          return true;
        },
        new Function("return true")
      ].map(a => ({ a })),
      [1, null, undefined].map(a => ({ a }))
    );
    expect(getExplanations(checkFunction, { a: 1 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Function
        },
        value: 1
      }
    ]);
    expect(getExplanations(checkFunction, { a: null })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Function
        },
        value: null
      }
    ]);
    expect(getExplanations(checkFunction, { a: undefined })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Function
        },
        value: undefined
      }
    ]);
  });
  test("v.symbol", () => {
    const checkSymbol = v(v.symbol);
    testValidatorImpure(
      checkSymbol,
      [Symbol.for("quartet"), Symbol.for("andrew"), Symbol("123")],
      ["symbol", null, undefined]
    );
    expect(getExplanations(checkSymbol, "symbol")).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Symbol
        },
        value: "symbol"
      }
    ]);
    expect(getExplanations(checkSymbol, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Symbol
        },
        value: null
      }
    ]);
    expect(getExplanations(checkSymbol, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Symbol
        },
        value: undefined
      }
    ]);
  });
  test("{ a: v.symbol }", () => {
    const checkSymbol = v({ a: v.symbol });
    testValidatorImpure(
      checkSymbol,
      [Symbol.for("quartet"), Symbol.for("andrew"), Symbol("123")].map(a => ({
        a
      })),
      ["symbol", null, undefined].map(a => ({ a }))
    );
    expect(getExplanations(checkSymbol, { a: "symbol" })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Symbol
        },
        value: "symbol"
      }
    ]);
    expect(getExplanations(checkSymbol, { a: null })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Symbol
        },
        value: null
      }
    ]);
    expect(getExplanations(checkSymbol, { a: undefined })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Symbol
        },
        value: undefined
      }
    ]);
  });
  test("v.positive", () => {
    const checkPositive = v(v.positive);
    testValidatorImpure(
      checkPositive,
      [
        1,
        1.5,
        Infinity,
        [1],
        "1",
        {
          valueOf() {
            return 1;
          }
        }
      ],
      [0, null, -Infinity, -1, NaN, undefined, {}, []]
    );
    expect(getExplanations(checkPositive, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: 0
      }
    ]);
    expect(getExplanations(checkPositive, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: null
      }
    ]);
    expect(getExplanations(checkPositive, -Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(checkPositive, -1)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: -1
      }
    ]);
    expect(getExplanations(checkPositive, NaN)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: NaN
      }
    ]);
    expect(getExplanations(checkPositive, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: undefined
      }
    ]);
    expect(getExplanations(checkPositive, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: {}
      }
    ]);
    expect(getExplanations(checkPositive, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: []
      }
    ]);
  });
  test("{ a: v.positive }", () => {
    const checkPositive = v({ a: v.positive });
    testValidatorImpure(
      checkPositive,
      [
        1,
        1.5,
        Infinity,
        [1],
        "1",
        {
          valueOf() {
            return 1;
          }
        }
      ].map(a => ({ a })),
      [0, null, -Infinity, -1, NaN, undefined, {}, []].map(a => ({ a }))
    );
    expect(getExplanations(checkPositive, { a: 0 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: 0
      }
    ]);
    expect(getExplanations(checkPositive, { a: null })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: null
      }
    ]);
    expect(getExplanations(checkPositive, { a: -Infinity })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: -Infinity
      }
    ]);
    expect(getExplanations(checkPositive, { a: -1 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: -1
      }
    ]);
    expect(getExplanations(checkPositive, { a: NaN })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: NaN
      }
    ]);
    expect(getExplanations(checkPositive, { a: undefined })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: undefined
      }
    ]);
    expect(getExplanations(checkPositive, { a: {} })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: {}
      }
    ]);
    expect(getExplanations(checkPositive, { a: [] })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Positive
        },
        value: []
      }
    ]);
  });
  test("v.negative", () => {
    const checkNegative = v(v.negative);
    testValidatorImpure(
      checkNegative,
      [
        -1,
        -1.5,
        -Infinity,
        [-1],
        "-1",
        {
          valueOf() {
            return -1;
          }
        }
      ],
      [0, null, Infinity, 1, NaN, undefined, {}, []]
    );
    expect(getExplanations(checkNegative, 0)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: 0
      }
    ]);
    expect(getExplanations(checkNegative, null)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: null
      }
    ]);
    expect(getExplanations(checkNegative, Infinity)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(checkNegative, 1)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: 1
      }
    ]);
    expect(getExplanations(checkNegative, NaN)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: NaN
      }
    ]);
    expect(getExplanations(checkNegative, undefined)).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: undefined
      }
    ]);
    expect(getExplanations(checkNegative, {})).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: {}
      }
    ]);
    expect(getExplanations(checkNegative, [])).toEqual([
      {
        path: [],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: []
      }
    ]);
  });
  test("{ a: v.negative }", () => {
    const checkNegative = v({ a: v.negative });
    testValidatorImpure(
      checkNegative,
      [
        -1,
        -1.5,
        -Infinity,
        [-1],
        "-1",
        {
          valueOf() {
            return -1;
          }
        }
      ].map(a => ({ a })),
      [0, null, Infinity, 1, NaN, undefined, {}, []].map(a => ({ a }))
    );
    expect(getExplanations(checkNegative, { a: 0 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: 0
      }
    ]);
    expect(getExplanations(checkNegative, { a: null })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: null
      }
    ]);
    expect(getExplanations(checkNegative, { a: Infinity })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: Infinity
      }
    ]);
    expect(getExplanations(checkNegative, { a: 1 })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: 1
      }
    ]);
    expect(getExplanations(checkNegative, { a: NaN })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: NaN
      }
    ]);
    expect(getExplanations(checkNegative, { a: undefined })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: undefined
      }
    ]);
    expect(getExplanations(checkNegative, { a: {} })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: {}
      }
    ]);
    expect(getExplanations(checkNegative, { a: [] })).toEqual([
      {
        path: ["a"],
        innerExplanations: [],
        schema: {
          type: ExplanationSchemaType.Negative
        },
        value: []
      }
    ]);
  });
});
