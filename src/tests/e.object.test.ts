import { e as v } from "..";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v({ ... })", () => {
  test("v({})", () => {
    const notNull = v({});
    testValidatorImpure(
      notNull,
      [{}, 1, 0, false, true, "", []],
      [null, undefined]
    );
  });
  test("v({ a: number })", () => {
    const notNull = v({ a: v.number });
    testValidatorImpure(
      notNull,
      [{ a: NaN }, { a: Infinity }, { a: 1, b: "123" }],
      [null, undefined, {}, 1, 0, false, true, "", []]
    );
  });
  test('v({ a: number, [restOmit]: ["valid"] })', () => {
    const notNull = v({ a: v.number, [v.restOmit]: ["valid"] });
    testValidatorImpure(
      notNull,
      [{ a: NaN }, { a: Infinity }, { a: 1 }],
      [null, undefined, {}, 1, 0, false, true, "", []]
    );
  });
  test("v({ [restOmit]: something })", () => {
    const notNull = v({
      [v.restOmit]: ["andrew"]
    });
    testValidatorImpure(
      notNull,
      [{}, 1, 0, false, true, "", []],
      [null, undefined]
    );
  });
  test("v({ [rest]: number })", () => {
    const notNull = v({
      [v.rest]: v.number
    });
    testValidatorImpure(
      notNull,
      [{}, 1, 0, false, true, "", [], { a: 1 }],
      [{ b: "string" }, null, undefined]
    );
  });

  test('v({ [rest]: number, [restOmit]: ["valid"] })', () => {
    const notNull = v({
      [v.rest]: v.number,
      [v.restOmit]: ["valid"]
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
        { valid: null }
      ],
      [{ b: "string" }, null, undefined]
    );
  });
  test("v({ a: string, [rest]: number })", () => {
    const notNull = v({
      a: v.string,
      [v.rest]: v.number
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
        { a: "1", b: "1" }
      ]
    );
  });
  test('v({ [rest]: number, a: string, [restOmit]: ["b"] })', () => {
    const notNull = v({
      a: v.string,
      [v.rest]: v.number,
      [v.restOmit]: ["b"]
    });
    testValidatorImpure(
      notNull,
      [
        { a: "" },
        { a: "1" },
        { a: "1", b: 1 },
        { a: "1", b: 1, c: 2 },
        { a: "1", b: null },
        { a: "1", b: 2 }
      ],
      [{ b: "string" }, null, undefined, { a: 1 }, {}, [], { a: null }]
    );
  });
  test("{ v.pair }", () => {
    let pairFromValidator: any | null = null;
    const checkDict = v({
      [v.rest]: v.pair(
        v.custom(pair => {
          pairFromValidator = pair;
          return true;
        })
      )
    });
    expect(
      checkDict({
        a: 123
      })
    ).toBe(true);
    expect(pairFromValidator).toEqual({ key: "a", value: 123 });
  });
  test("{ v.pair }", () => {
    let pairFromValidator: any | null = null;
    const checkDict = v({
      a: v.pair(
        v.custom(pair => {
          pairFromValidator = pair;
          return true;
        })
      )
    });
    expect(
      checkDict({
        a: 123
      })
    ).toBe(true);
    expect(pairFromValidator).toEqual({ key: "a", value: 123 });
  });
  test("symbol prop", () => {
    const checkQuartet = v({
      [Symbol.for("quartet")]: v.number
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
        true
      ],
      [null, undefined]
    );
  });
});
