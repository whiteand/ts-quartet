import { v } from "../index";
import { snapshot, tables, puretables } from "./utils";
import { funcSchemaWithNot, primitives } from "./mocks";
import { FunctionSchema } from "../types";

const funcSchemaWithNotHandleError: FunctionSchema = () => ({
  check: value => `typeof ${value} === 'number' && ${value} % 3 === 0`,
  not: value => `(typeof ${value} !== 'number' || ${value} % 3 !== 0)`,
  handleError: (value, ctx) => `${ctx}.explanations.push(${value})`
});

describe("variants", () => {
  test("01. v([])", () => {
    const validator = v([]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [], [...primitives, {}, []]);
  });
  test("02. v([pureFunc])", () => {
    const validator = v([funcSchemaWithNot]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [2, 4, 6, 8],
      [
        ...primitives.filter(e => typeof e !== "number" || e % 2 !== 0),
        1,
        3,
        5,
        7,
        {},
        []
      ]
    );
  });
  test("03. v([pureFunc, is3k])", () => {
    const validator = v([funcSchemaWithNot, funcSchemaWithNotHandleError]);
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(validator, [2, 4, 3, 6, 8, 9, 0], [[1, [1]]]);
  });
  test("04. v([pureFunc, pureFunc])", () => {
    const validator = v([funcSchemaWithNot, funcSchemaWithNot]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [2, 4, 6, 8],
      [
        ...primitives.filter(e => typeof e !== "number" || e % 2 !== 0),
        1,
        3,
        5,
        7,
        {},
        []
      ]
    );
  });
  test("05. v([1,2,3,4,5])", () => {
    const validator = v([1, 2, 3, 4, 5]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [1, 2, 3, 4, 5],
      [
        "1",
        "2",
        "3",
        "4",
        "5",
        ...primitives.filter(e => typeof e !== "number" || e < 1 || e > 5)
      ]
    );
  });
  test('06. v(["A", "B", Symbol.for("test")])', () => {
    const validator = v(["A", "B", Symbol.for("variant")]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      ["A", "B", Symbol.for("variant")],
      [1, 2, 3, 4, 5, ...primitives]
    );
  });
  test('07. v(["A", "B", 1,2,3, isEven])', () => {
    const validator = v(["A", "B", 1, 2, 3, funcSchemaWithNot]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      ["A", "B", 1, 2, 3, 4, 6, 8, 10],
      [5, ...primitives.filter(e => typeof e !== "number")]
    );
  });
  test("08 v([{ a: impure }, { a: pure }])", () => {
    const validator = v([funcSchemaWithNotHandleError, funcSchemaWithNot]);
    tables(validator, [2, 4, 6, 8, 10], [["2", ["2"]]]);
  });
  test("09. v([{ a: impure }, pure]", () => {
    const validator = v([{ a: funcSchemaWithNotHandleError }, v.number]);
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [1, 2, 3, 3, 4, { a: 3 }, { a: 6 }],
      [[null, []], ["1", [undefined]], [{ a: 2 }, [2]]]
    );
  });
});
