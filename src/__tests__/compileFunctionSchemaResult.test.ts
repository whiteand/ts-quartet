import { compileFunctionSchemaResult } from "../compileFunctionSchemaResult";
import { FunctionSchema } from "../types";
import { getDescription } from "./getDescription";

describe("compileFunctionSchemaResult", () => {
  test("only check", () => {
    const funcSchema: FunctionSchema = () => ({
      check: id => `${id} === 42`
    });
    const validator = compileFunctionSchemaResult(funcSchema());
    expect(validator(41)).toBe(false);
    expect(validator.explanations).toEqual([]);
    expect(validator("42")).toBe(false);
    expect(validator.explanations).toEqual([]);
    expect(validator(42)).toBe(true);
    expect(validator.explanations).toEqual([]);
    expect(getDescription(validator)).toMatchInlineSnapshot(`
      Object {
        "_": "function validator(value) {
              
              return value === 42
            }",
        "explanations": Array [],
      }
    `);
  });
  test("check + prepare", () => {
    const funcSchema: FunctionSchema = () => ({
      check: (id, ctx) => `${id} === ${ctx}.N`,
      prepare: ctx => {
        ctx.N = 42;
      }
    });
    const validator = compileFunctionSchemaResult(funcSchema());
    expect(getDescription(validator)).toMatchInlineSnapshot(`
      Object {
        "N": 42,
        "_": "function validator(value) {
              
              return value === validator.N
            }",
        "explanations": Array [],
      }
    `);
  });
  test("check + handleError", () => {
    const funcSchema: FunctionSchema = () => ({
      check: (id, ctx) => `${id} === ${ctx}.N`,
      prepare: ctx => {
        ctx.N = 42;
      },
      handleError: (id, ctx) =>
        `${ctx}.explanations.push(\`\${JSON.stringify(${id})} is not a 42\`)`
    });

    const validator = compileFunctionSchemaResult(funcSchema());
    expect(validator(41)).toBe(false);
    expect(validator.explanations).toMatchInlineSnapshot(`
                            Array [
                              "41 is not a 42",
                            ]
                    `);
    expect(validator(42)).toBe(true);
    expect(validator.explanations).toEqual([]);
    expect(getDescription(validator)).toMatchInlineSnapshot(`
      Object {
        "N": 42,
        "_": "function validator(value) {
            validator.explanations = []
            if (value === validator.N) {
              return true
            }
            validator.explanations.push(\`\${JSON.stringify(value)} is not a 42\`)
            return false
          }",
        "explanations": Array [],
      }
    `);
  });
});
