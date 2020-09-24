import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v.[type]", () => {
  test("v.boolean", () => {
    const checkBoolean = v(v.boolean);
    testValidator(checkBoolean, [true, false], ["true", "false", 1, 0]);
  });
  test("{ a: v.boolean }", () => {
    const checkBoolean = v({ a: v.boolean });
    testValidator(
      checkBoolean,
      [{ a: true }, { a: false }],
      ["true", "false", 1, 0].map(a => ({ a }))
    );
  });
  test("v.number", () => {
    const checkNumber = v(v.number);
    testValidator(
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
  test("v.string", () => {
    const checkString = v(v.string);
    testValidator(
      checkString,
      ["1", ""],
      [Symbol.for("quartet"), String, null, 0, undefined, true, false]
    );
  });
  test("v.finite", () => {
    const checkFinite = v(v.finite);
    testValidator(
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
  });
  test("{ a: v.finite }", () => {
    const checkFinite = v({ a: v.finite });
    testValidator(checkFinite, [1, 0, 1.5, -1].map(a => ({ a })), [
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
      },
      ...[
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
    ]);
  });
  test("v.safeInteger", () => {
    const checkSafeInteger = v(v.safeInteger);
    testValidator(
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
  });
  test("v.function", () => {
    const checkFunction = v(v.function);
    testValidator(
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
  });
  test("{ a: v.function}", () => {
    const checkFunction = v({ a: v.function });
    testValidator(
      checkFunction,
      [
        () => true,
        function() {
          return true;
        },
        new Function("return true")
      ].map(a => ({ a })),
      [1, null, undefined, {}, [], { a: 1 }, { a: null }]
    );
  });
  test("v.symbol", () => {
    const checkSymbol = v(v.symbol);
    testValidator(
      checkSymbol,
      [Symbol.for("quartet"), Symbol.for("andrew"), Symbol("123")],
      ["symbol", null, undefined]
    );
  });
  test("{ a: v.symbol }", () => {
    const checkSymbol = v({ a: v.symbol });
    testValidator(
      checkSymbol,
      [Symbol.for("quartet"), Symbol.for("andrew"), Symbol("123")].map(a => ({
        a
      })),
      [
        "symbol",
        null,
        undefined,
        ...["symbol", null, undefined].map(a => ({ a }))
      ]
    );
  });
  test("v.positive", () => {
    const checkPositive = v(v.positive);
    testValidator(
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
  });
  test("{ a: v.positive }", () => {
    const checkPositive = v({ a: v.positive });
    testValidator(
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
      [
        0,
        null,
        -Infinity,
        -1,
        NaN,
        undefined,
        {},
        [],
        ...[0, null, -Infinity, -1, NaN, undefined, {}, []].map(a => ({ a }))
      ]
    );
  });
  test("v.negative", () => {
    const checkNegative = v(v.negative);
    testValidator(
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
  });
  test("{ a: v.negative }", () => {
    const checkNegative = v({ a: v.negative });
    testValidator(
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
      [
        0,
        null,
        Infinity,
        1,
        NaN,
        undefined,
        {},
        [],
        ...[0, null, Infinity, 1, NaN, undefined, {}, []].map(a => ({ a }))
      ]
    );
  });
});
