import {
  and,
  anySchema,
  array,
  arrayOf,
  boolean,
  custom,
  finite,
  functionSchema,
  max,
  maxLength,
  min,
  minLength,
  negative,
  neverSchema,
  not,
  notANumber,
  number,
  objectSchemaWithoutRest,
  objectSchemaWithRest,
  pair,
  positive,
  safeInteger,
  string,
  symbol,
  testSchema,
  variant,
} from "../schemas";
import { v } from "../v";
import { schemaToExplanationSchema } from "./schemaToExplanationSchema";
import { describe, expect } from "vitest";

describe("schemaToExplanationSchema", (test) => {
  test("primitives", () => {
    expect(schemaToExplanationSchema(null)).toMatchInlineSnapshot(`null`);
    expect(schemaToExplanationSchema(undefined)).toMatchInlineSnapshot(
      `undefined`,
    );
    expect(schemaToExplanationSchema(NaN)).toMatchInlineSnapshot(`NaN`);
    expect(schemaToExplanationSchema(false)).toMatchInlineSnapshot(`false`);
    expect(schemaToExplanationSchema(true)).toMatchInlineSnapshot(`true`);
    expect(schemaToExplanationSchema(0)).toMatchInlineSnapshot(`0`);
    expect(schemaToExplanationSchema(1)).toMatchInlineSnapshot(`1`);
    expect(schemaToExplanationSchema(Infinity)).toMatchInlineSnapshot(
      `Infinity`,
    );
    expect(schemaToExplanationSchema(-Infinity)).toMatchInlineSnapshot(
      `-Infinity`,
    );
    expect(
      schemaToExplanationSchema(Symbol.for("quartet")),
    ).toMatchInlineSnapshot(`Symbol(quartet)`);
  });
  test("and", () => {
    const schema = and([safeInteger(), min(1, false), max(5, false)]);
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "schemas": [
          {
            "type": "SafeInteger",
          },
          {
            "isExclusive": false,
            "minValue": 1,
            "type": "Min",
          },
          {
            "isExclusive": false,
            "maxValue": 5,
            "type": "Max",
          },
        ],
        "type": "And",
      }
    `);
  });
  test("anySchema", () => {
    const schema = anySchema();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Any",
      }
    `);
  });
  test("array", () => {
    const schema = array();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Array",
      }
    `);
  });
  test("arrayOf", () => {
    const schema = arrayOf(number());
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "elementSchema": {
          "type": "Number",
        },
        "type": "ArrayOf",
      }
    `);
  });
  test("boolean", () => {
    const schema = boolean();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Boolean",
      }
    `);
  });
  test("custom", () => {
    const schema = custom((value) => typeof value === "number");
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "description": "custom",
        "innerExplanations": [],
        "type": "Custom",
      }
    `);
  });
  test("finite", () => {
    const schema = finite();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Finite",
      }
    `);
  });
  test("functionSchema", () => {
    const schema = functionSchema();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Function",
      }
    `);
  });
  test("max", () => {
    expect(schemaToExplanationSchema(max(5, true))).toMatchInlineSnapshot(`
      {
        "isExclusive": true,
        "maxValue": 5,
        "type": "Max",
      }
    `);
    expect(schemaToExplanationSchema(max(5, false))).toMatchInlineSnapshot(`
      {
        "isExclusive": false,
        "maxValue": 5,
        "type": "Max",
      }
    `);
  });
  test("maxLength", () => {
    expect(schemaToExplanationSchema(maxLength(5, true)))
      .toMatchInlineSnapshot(`
        {
          "isExclusive": true,
          "maxLength": 5,
          "type": "MaxLength",
        }
      `);
    expect(schemaToExplanationSchema(maxLength(5, false)))
      .toMatchInlineSnapshot(`
        {
          "isExclusive": false,
          "maxLength": 5,
          "type": "MaxLength",
        }
      `);
  });
  test("min", () => {
    expect(schemaToExplanationSchema(min(5, true))).toMatchInlineSnapshot(`
      {
        "isExclusive": true,
        "minValue": 5,
        "type": "Min",
      }
    `);
    expect(schemaToExplanationSchema(min(5, false))).toMatchInlineSnapshot(`
      {
        "isExclusive": false,
        "minValue": 5,
        "type": "Min",
      }
    `);
  });
  test("minLength", () => {
    expect(schemaToExplanationSchema(minLength(5, true)))
      .toMatchInlineSnapshot(`
        {
          "isExclusive": true,
          "minLength": 5,
          "type": "MinLength",
        }
      `);
    expect(schemaToExplanationSchema(minLength(5, false)))
      .toMatchInlineSnapshot(`
        {
          "isExclusive": false,
          "minLength": 5,
          "type": "MinLength",
        }
      `);
  });
  test("negative", () => {
    const schema = negative();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Negative",
      }
    `);
  });
  test("neverSchema", () => {
    const schema = neverSchema();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Never",
      }
    `);
  });
  test("not", () => {
    const schema = not(number());
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "schema": {
          "type": "Number",
        },
        "type": "Not",
      }
    `);
  });
  test("notANumber", () => {
    const schema = notANumber();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "NotANumber",
      }
    `);
  });
  test("number", () => {
    const schema = number();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Number",
      }
    `);
  });
  test("object schema", () => {
    expect(schemaToExplanationSchema(objectSchemaWithoutRest({ a: number() })))
      .toMatchInlineSnapshot(`
        {
          "propsSchemas": {
            "a": {
              "type": "Number",
            },
          },
          "type": "Object",
        }
      `);
    expect(
      schemaToExplanationSchema(
        objectSchemaWithRest({ a: number() }, v.string, {}),
      ),
    ).toMatchInlineSnapshot(`
      {
        "[v.restOmit]": [],
        "[v.rest]": {
          "type": "String",
        },
        "propsSchemas": {
          "a": {
            "type": "Number",
          },
        },
        "type": "Object",
      }
    `);
    expect(
      schemaToExplanationSchema(
        objectSchemaWithRest({ a: number() }, v.string, { valid: true }),
      ),
    ).toMatchInlineSnapshot(`
      {
        "[v.restOmit]": [
          "valid",
        ],
        "[v.rest]": {
          "type": "String",
        },
        "propsSchemas": {
          "a": {
            "type": "Number",
          },
        },
        "type": "Object",
      }
    `);
  });
  test("pair", () => {
    const schema = pair(
      objectSchemaWithoutRest({ key: testSchema(/^valid/), value: number() }),
    );
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "keyValueSchema": {
          "propsSchemas": {
            "key": {
              "description": "/^valid/",
              "type": "Test",
            },
            "value": {
              "type": "Number",
            },
          },
          "type": "Object",
        },
        "type": "Pair",
      }
    `);
  });
  test("positive", () => {
    const schema = positive();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Positive",
      }
    `);
  });
  test("safeInteger", () => {
    const schema = safeInteger();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "SafeInteger",
      }
    `);
  });
  test("string", () => {
    const schema = string();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "String",
      }
    `);
  });
  test("symbol", () => {
    const schema = symbol();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Symbol",
      }
    `);
  });
  test("testSchema", () => {
    const schema = testSchema(/^valid/);
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "description": "/^valid/",
        "type": "Test",
      }
    `);
  });
  test("variant", () => {
    const schema = variant([1, 2, 3, 4, 5]);
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      {
        "type": "Variant",
        "variants": [
          1,
          2,
          3,
          4,
          5,
        ],
      }
    `);
  });
});
