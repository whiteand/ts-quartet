import { v } from "../index";
import { snapshot, tables, puretables } from "./utils";
import { funcSchemaWithNotHandleError, funcSchemaWithNot } from "./mocks";

describe("v.rest", () => {
  test("00. v({ [v.rest]: funcSchemaWithNot })", () => {
    const validator = v({ [v.rest]: funcSchemaWithNot });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{}, { a: 2, b: 4, toString: 6 }],
      [{ a: 1 }, { a: 2, c: 1 }]
    );
  });
  test("01. v({ [v.rest]: funcSchemaWithNotHandleError })", () => {
    const validator = v({ [v.rest]: funcSchemaWithNotHandleError });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{}, { a: 2, b: 4, toString: 6 }],
      [[null, []], [{ a: 1 }, [1]], [{ a: 2, c: 3 }, [3]]]
    );
  });
  test("02. v({ a: 41, [v.rest]: funcSchemaWithNot })", () => {
    const validator = v({ a: 41, [v.rest]: funcSchemaWithNot });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: 41 }, { a: 41, b: 4, toString: 6 }],
      [{}, { a: 1 }, { a: 41, c: 1 }]
    );
  });
  test("03. v({ a: 41 [v.rest]: funcSchemaWithNotHandleError })", () => {
    const validator = v({ a: 41, [v.rest]: funcSchemaWithNotHandleError });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: 41 }, { a: 41, b: 4, toString: 6 }],
      [[null, []], [{}, []], [{ a: 1 }, []], [{ a: 41, c: 1 }, [1]]]
    );
  });
  test("04. v({ a: funcSchemaWithNotHandleError, [v.rest]: funcSchemaWithNot })", () => {
    const validator = v({
      a: funcSchemaWithNotHandleError,
      [v.rest]: funcSchemaWithNot
    });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: 42 }, { a: 42, b: 4, toString: 6 }],
      [[null, []], [{}, [undefined]], [{ a: 1 }, [1]], [{ a: 42, c: 1 }, []]]
    );
  });
  test("05. v({ a: funcSchemaWithNotHandleError, [v.rest]: funcSchemaWithNotHandleError })", () => {
    const validator = v({
      a: funcSchemaWithNotHandleError,
      [v.rest]: funcSchemaWithNotHandleError
    });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: 42 }, { a: 42, b: 4, toString: 6 }],
      [[null, []], [{}, [undefined]], [{ a: 1 }, [1]], [{ a: 42, c: 1 }, [1]]]
    );
  });
});
