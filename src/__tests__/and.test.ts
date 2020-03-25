import { v } from "../index";
import { snapshot, tables, puretables } from "./utils";
import {
  funcSchema,
  funcSchemaWithHandleError,
  funcSchemaWithPrepare,
  funcSchemaWithNot,
  primitives
} from "./mocks";
import { FunctionSchema } from "../types";

describe("v.and", () => {
  test("v.compileAnd()", () => {
    const validator = v.compileAnd();
    expect(validator.pure).toBe(true);
    snapshot(validator);
  });
  test("v.compileAnd(1)", () => {
    const validator = v.compileAnd(1);
    snapshot(validator);
    puretables(validator, [1], ["1", false, new Number(1)]);
  });
  test("v.compileAnd(1, 1)", () => {
    const validator = v.compileAnd(1, 1);
    snapshot(validator);
    puretables(validator, [1], ["1", false, new Number(1)]);
  });
  test("v.compileAnd(1, 2)", () => {
    const validator = v.compileAnd(1, 2);
    expect(validator.pure).toBe(true);
    snapshot(validator);
  });
  test("v.compileAnd(1, 1, 2)", () => {
    const validator = v.compileAnd(1, 1, 2);
    expect(validator.pure).toBe(true);
    snapshot(validator);
  });
  test("Conflict with primitive", () => {
    const validator = v.compileAnd(1, funcSchema);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    const validatorWithExplanations = v.compileAnd(
      1,
      funcSchemaWithHandleError
    );
    expect(validatorWithExplanations.pure).toBe(false);
    expect(validatorWithExplanations.explanations).toMatchInlineSnapshot(`
      Array [
        1,
      ]
    `);
    snapshot(validatorWithExplanations);
  });
  test("v.compileAnd(funcSchemaWithPrepare, funcWithoutPrepare)", () => {
    const validator = v.compileAnd(funcSchemaWithPrepare, funcSchema);
    snapshot(validator);
    puretables(validator, [2, 4, 6, 8], [1, 3, 5, 7]);
  });
  test("v.compileAnd(funcWithNot, funcWithoutNot)", () => {
    const validator = v.compileAnd(funcSchemaWithNot, funcSchema);
    snapshot(validator);
    puretables(validator, [2, 4, 6, 8], [1, 3, 5, 7]);
  });
  test("v.compileAnd(funcWithHandle, funcWithoutHandle)", () => {
    const validator = v.compileAnd(funcSchemaWithHandleError, funcSchema);
    snapshot(validator);
    expect(validator.pure).toBe(false);
    tables(validator, [2, 4, 6, 8], [[1, [1]], [3, [3]], [5, [5]], [7, [7]]]);
  });
  test("v.compileAnd({ a: funcWithoutHandle }, { b: funcWithHandle })", () => {
    const validator = v.compileAnd(
      { a: funcSchema },
      { b: funcSchemaWithHandleError }
    );
    snapshot(validator);
    expect(validator.pure).toBe(false);
    tables(
      validator,
      [{ a: 2, b: 4 }, { a: 4, b: 2 }],
      [
        [null, []],
        [{}, []],
        [{ a: 2 }, [undefined]],
        [{ b: 2 }, []],
        [{ a: 1, b: 4 }, []],
        [{ a: 2, b: 3 }, [3]]
      ]
    );
  });
  test("v.compileAnd({ a: funcWithoutHandle, [v.rest]: funcWithoutHandle }, { b: funcWithHandle, [v.rest]: funcWithHandle })", () => {
    const funcSchemaWithHandleError: FunctionSchema = () => ({
      check: id => `typeof ${id} === 'number' && ${id} % 4 === 0`,
      not: id => `typeof ${id} !== 'number' || ${id} % 4 !== 0`,
      handleError: (id, ctx) => `${ctx}.explanations.push(${id} + ' is not 4k')`
    });
    const validator = v.compileAnd(
      { a: funcSchema, [v.rest]: funcSchema },
      { b: funcSchemaWithHandleError, [v.rest]: funcSchemaWithHandleError }
    );
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: 4, b: 4 }, { a: 4, b: 4, c: 4 }],
      [
        ...primitives.map(v => [v, []] as [any, any[]]),
        [{}, []],
        [{ a: 2 }, ["undefined is not 4k"]],
        [{ a: 2, b: 4 }, ["2 is not 4k"]],
        [{ a: 4, b: 4, c: 2 }, ["2 is not 4k"]],
        [{ a: 4, b: 4, c: 1 }, []]
      ]
    );
  });
  test("v.compileAnd(func, [])", () => {
    const validator = v.compileAnd(funcSchema, []);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [], [2, 4, 6, 8, 10]);
  });
  test("v.compileAnd(func, [func])", () => {
    const validator = v.compileAnd(funcSchemaWithNot, [funcSchemaWithNot]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [2, 4, 6, 8, 10],
      [...primitives.filter(v => typeof v !== "number"), 1, 3, 5, 7]
    );
  });
  test("v.compileAnd(func, [funcWithHandle, funcWithoutHandle])", () => {
    const funcSchemaWithHandleError: FunctionSchema = () => ({
      check: id => `typeof ${id} === 'number' && ${id} % 4 === 0`,
      not: id => `typeof ${id} !== 'number' || ${id} % 4 !== 0`,
      handleError: (id, ctx) => `${ctx}.explanations.push(${id} + ' is not 4k')`
    });
    const funcSchemaWithNot: FunctionSchema = () => ({
      check: id => `typeof ${id} === 'number' && ${id} % 5 === 0`,
      not: id => `typeof ${id} !== 'number' || ${id} % 5 !== 0`
    });
    const validator = v.compileAnd(funcSchema, [
      funcSchemaWithHandleError,
      funcSchemaWithNot
    ]);
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [4, 8, 10],
      [
        ...[...primitives.filter(v => typeof v !== "number"), 1, 3, 5, 7].map(
          invalid => [invalid, []] as [any, any[]]
        ),
        [2, ["2 is not 4k"]],
        [6, ["6 is not 4k"]]
      ]
    );
  });
  test("v.compileAnd(func, [funcWithoutHandle, funcWithoutHandle])", () => {
    const validator = v.compileAnd(funcSchemaWithNot, [funcSchema, funcSchema]);
    expect(validator.pure).toBe(true);
    snapshot(validator);
  });
});
