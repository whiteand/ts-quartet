import { v } from "../index";
import { snapshot, puretables, tables } from "./utils";
import {
  primitives,
  funcSchemaWithPrepare,
  funcSchema,
  funcSchemaWithNot,
  funcSchemaWithNotHandleError
} from "./mocks";

describe("arrayOf", () => {
  test("00. v.compileArrayOf(null)", () => {
    const validator = v.compileArrayOf<null>(null);
    snapshot(validator);
    puretables(
      validator,
      [[], [null], [null, null]],
      [...primitives, [undefined], [1], ["null"]]
    );
  });
  test("01. v.compileArrayOf(undefined)", () => {
    const validator = v.compileArrayOf<undefined>(undefined);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], [undefined], [undefined, undefined]],
      [...primitives, [null], [1], ["undefined"]]
    );
  });
  test("02. v.compileArrayOf(42)", () => {
    const validator = v.compileArrayOf<42>(42);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], [42], [42, 42]],
      [...primitives, [null], [42, , 42], [undefined], [1], ["undefined"]]
    );
  });
  test("03. v.compileArrayOf(NaN)", () => {
    const validator = v.compileArrayOf<number>(NaN);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], [0 / 0], [Infinity / Infinity, NaN]],
      [...primitives, [null], [42, , 42], [undefined], [1], ["undefined"]]
    );
  });
  test('04. v.compileArrayOf("true")', () => {
    const validator = v.compileArrayOf<"true">("true");
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], ["true"], ["true", "true"]],
      [
        ...primitives,
        [null],
        [true],
        [42, , 42],
        [undefined],
        [1],
        ["undefined"]
      ]
    );
  });
  test('05. v.compileArrayOf("false")', () => {
    const validator = v.compileArrayOf<"false">("false");
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], ["false"], ["false", "false"]],
      [
        ...primitives,
        [null],
        [false],
        [42, , 42],
        [undefined],
        [1],
        ["undefined"]
      ]
    );
  });
  test("06. v.compileArrayOf(true)", () => {
    const validator = v.compileArrayOf<true>(true);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], [true], [true, true]],
      [
        ...primitives,
        [null],
        [false],
        ["true"],
        [42, , 42],
        [undefined],
        [1],
        ["undefined"]
      ]
    );
  });
  test("07. v.compileArrayOf(false)", () => {
    const validator = v.compileArrayOf<false>(false);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], [false], [false, false]],
      [
        ...primitives,
        [null],
        [true],
        ["true"],
        [42, , 42],
        [undefined],
        [1],
        ["undefined"]
      ]
    );
  });
  test('08. v.compileArrayOf(Symbol.for("test"))', () => {
    const validator = v.compileArrayOf<symbol>(Symbol.for("test"));
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], [Symbol.for("test")], [Symbol.for("test"), Symbol.for("test")]],
      [
        ...primitives,
        [null],
        [true],
        [Symbol("test")],
        ["true"],
        [42, , 42],
        [undefined],
        [1],
        ["undefined"]
      ]
    );
  });
  test("09. v.compileArrayOf(funcWithPrepare)", () => {
    const validator = v.compileArrayOf(funcSchemaWithPrepare);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [[], [42], [2, 4, 8]], [[1], [2, 4, 6, 1]]);
  });
  test("10. v.compileArrayOf(funcWithoutPrepare)", () => {
    const validator = v.compileArrayOf(funcSchema);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [[], [42], [2, 4, 8]], [[1], [2, 4, 6, 1]]);
  });
  test("11. v.compileArrayOf(funcWithNot)", () => {
    const validator = v.compileArrayOf(funcSchemaWithNot);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [[], [42], [2, 4, 8]], [[1], [2, 4, 6, 1]]);
  });
  test("12. v.compileArrayOf([funcSchemaWithHandle, 13])", () => {
    const validator = v.compileArrayOf([funcSchemaWithNotHandleError, 13]);
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [[], [42], [2, 4, 8], [13, 13, 2, 4, 6]],
      [[[1], [1]], [[2, 4, 6, 3], [3]]]
    );
  });
  test("13. v.compileArrayOf(funcWithHandle)", () => {
    const validator = v.compileArrayOf(funcSchemaWithNotHandleError);
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [[], [42], [2, 4, 8], [2, 4, 6]],
      [[[1], [1]], [[2, 4, 6, 3], [3]]]
    );
  });
  test("14. v.compileArrayOf([funcSchema, 13])", () => {
    const validator = v.compileArrayOf([funcSchemaWithNot, 13]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], [42], [2, 4, 8], [13, 13, 2, 4, 6]],
      [[1], [2, 4, 6, 3]]
    );
  });
  test("15. v.compileArrayOf({ a: 13 })", () => {
    const validator = v.compileArrayOf({ a: 13 });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [[], [{ a: 13 }], [{ a: 13, b: 1 }, { a: 13 }]],
      [...primitives.map(e => [e]), [{}], [{ a: 12 }]]
    );
  });
  test("16. v.compileArrayOf({ a: funcWithHandle })", () => {
    const validator = v.compileArrayOf({ a: funcSchemaWithNotHandleError });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [[], [{ a: 2 }], [{ a: 4, b: 1 }, { a: 6 }]],
      [
        [null, []],
        [[{ a: 1 }], [1]],
        [[{ a: 2 }, { b: 3 }], [undefined]],
        [[{ a: 2 }, { a: 4, b: 1 }, { a: 5 }], [5]]
      ]
    );
  });
  test("17. v.compileArrayOf({ a: 41, [v.rest]: funcWithHandle })", () => {
    const validator = v.compileArrayOf({
      a: 41,
      [v.rest]: funcSchemaWithNotHandleError
    });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [[], [{ a: 41 }], [{ a: 41, b: 2 }], [{ a: 41 }, { a: 41, b: 2 }]],
      [
        [[{}], []],
        [[{ a: 41, b: 1 }], [1]],
        [[{ a: 41, b: 2, c: 4, d: 8, e: 9 }], [9]],
        [
          [
            { a: 41, b: 2, c: 4, d: 1, e: 9 },
            { a: 41, b: 2, c: 4, d: 8, e: 9 }
          ],
          [1]
        ]
      ]
    );
  });
  test("18. v.compileArrayOf({ a: 41, [v.rest]: funcWithoutHandle })", () => {
    const validator = v.compileArrayOf({
      a: 41,
      [v.rest]: funcSchemaWithNot
    });
    snapshot(validator);
    puretables(
      validator,
      [[], [{ a: 41 }], [{ a: 41, b: 2 }], [{ a: 41 }, { a: 41, b: 2 }]],
      [
        [{}],
        [{ a: 41, b: 1 }],
        [{ a: 41, b: 2, c: 4, d: 8, e: 9 }],
        [{ a: 41, b: 2, c: 4, d: 1, e: 9 }, { a: 41, b: 2, c: 4, d: 8, e: 9 }]
      ]
    );
  });
  test("19. v.compileArrayOf([])", () => {
    const validator = v.compileArrayOf([]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [[]], [...primitives, { length: 0 }, [1]]);
  });
  test("20. v.compileArrayOf([42])", () => {
    const validator = v.compileArrayOf([42]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
  });
  test("21. v.compileArrayOf([funcSchema, 13])", () => {
    const validator = v.compileArrayOf([funcSchema, 13]);
    snapshot(validator);
    puretables(
      validator,
      [[], [13], [13, 13]],
      [...primitives, [null], [13, , 13], [undefined], [1], ["undefined"]]
    );
  });
});
