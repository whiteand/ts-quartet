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
  variant
} from "../schemas";
import { v } from "../v";
import { schemaToExplanationSchema } from "./schemaToExplanationSchema";

describe("schemaToExplanationSchema", () => {
  test("primitives", () => {
    expect(schemaToExplanationSchema(null)).toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": null,
            }
        `);
    expect(schemaToExplanationSchema(undefined)).toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": undefined,
            }
        `);
    expect(schemaToExplanationSchema(NaN)).toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": NaN,
            }
        `);
    expect(schemaToExplanationSchema(false)).toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": false,
            }
        `);
    expect(schemaToExplanationSchema(true)).toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": true,
            }
        `);
    expect(schemaToExplanationSchema(0)).toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": 0,
            }
        `);
    expect(schemaToExplanationSchema(1)).toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": 1,
            }
        `);
    expect(schemaToExplanationSchema(Infinity)).toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": Infinity,
            }
        `);
    expect(schemaToExplanationSchema(-Infinity)).toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": -Infinity,
            }
        `);
    expect(schemaToExplanationSchema(Symbol.for("quartet")))
      .toMatchInlineSnapshot(`
            Object {
              "type": "Primitive",
              "value": Symbol(quartet),
            }
        `);
  });
  test("and", () => {
    const schema = and(safeInteger(), min(1, false), max(5, false));
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "schemas": Array [
          Object {
            "type": "SafeInteger",
          },
          Object {
            "isExclusive": false,
            "minValue": 1,
            "type": "Min",
          },
          Object {
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
      Object {
        "type": "Any",
      }
    `);
  });
  test("array", () => {
    const schema = array();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "type": "Array",
      }
    `);
  });
  test("arrayOf", () => {
    const schema = arrayOf(number());
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "elementSchema": Object {
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
      Object {
        "type": "Boolean",
      }
    `);
  });
  test("custom", () => {
    const schema = custom(value => typeof value === "number");
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "customValidator": [Function],
        "type": "Custom",
      }
    `);
  });
  test("finite", () => {
    const schema = finite();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "type": "Finite",
      }
    `);
  });
  test("functionSchema", () => {
    const schema = functionSchema();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "type": "Function",
      }
    `);
  });
  test("max", () => {
    expect(schemaToExplanationSchema(max(5, true))).toMatchInlineSnapshot(`
      Object {
        "isExclusive": true,
        "maxValue": 5,
        "type": "Max",
      }
    `);
    expect(schemaToExplanationSchema(max(5, false))).toMatchInlineSnapshot(`
      Object {
        "isExclusive": false,
        "maxValue": 5,
        "type": "Max",
      }
    `);
  });
  test("maxLength", () => {
    expect(schemaToExplanationSchema(maxLength(5, true)))
      .toMatchInlineSnapshot(`
      Object {
        "isExclusive": true,
        "maxLength": 5,
        "type": "MaxLength",
      }
    `);
    expect(schemaToExplanationSchema(maxLength(5, false)))
      .toMatchInlineSnapshot(`
      Object {
        "isExclusive": false,
        "maxLength": 5,
        "type": "MaxLength",
      }
    `);
  });
  test("min", () => {
    expect(schemaToExplanationSchema(min(5, true))).toMatchInlineSnapshot(`
      Object {
        "isExclusive": true,
        "minValue": 5,
        "type": "Min",
      }
    `);
    expect(schemaToExplanationSchema(min(5, false))).toMatchInlineSnapshot(`
      Object {
        "isExclusive": false,
        "minValue": 5,
        "type": "Min",
      }
    `);
  });
  test("minLength", () => {
    expect(schemaToExplanationSchema(minLength(5, true)))
      .toMatchInlineSnapshot(`
      Object {
        "isExclusive": true,
        "minLength": 5,
        "type": "MinLength",
      }
    `);
    expect(schemaToExplanationSchema(minLength(5, false)))
      .toMatchInlineSnapshot(`
      Object {
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
      Object {
        "type": "Negative",
      }
    `);
  });
  test("neverSchema", () => {
    const schema = neverSchema();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "type": "Never",
      }
    `);
  });
  test("not", () => {
    const schema = not(number());
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "schema": Object {
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
      Object {
        "type": "NotANumber",
      }
    `);
  });
  test("number", () => {
    const schema = number();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "type": "Number",
      }
    `);
  });
  test("object schema", () => {
    expect(schemaToExplanationSchema(objectSchemaWithoutRest({ a: number() })))
      .toMatchInlineSnapshot(`
      Object {
        "propsSchemas": Object {
          "a": Object {
            "type": "Number",
          },
        },
        "type": "Object",
      }
    `);
    expect(
      schemaToExplanationSchema(
        objectSchemaWithRest({ a: number() }, v.string, {})
      )
    ).toMatchInlineSnapshot(`
      Object {
        "[v.restOmit]": Array [],
        "[v.rest]": Object {
          "type": "String",
        },
        "propsSchemas": Object {
          "a": Object {
            "type": "Number",
          },
        },
        "type": "Object",
      }
    `);
    expect(
      schemaToExplanationSchema(
        objectSchemaWithRest({ a: number() }, v.string, { valid: true })
      )
    ).toMatchInlineSnapshot(`
      Object {
        "[v.restOmit]": Array [
          "valid",
        ],
        "[v.rest]": Object {
          "type": "String",
        },
        "propsSchemas": Object {
          "a": Object {
            "type": "Number",
          },
        },
        "type": "Object",
      }
    `);
  });
  test("pair", () => {
    const schema = pair(
      objectSchemaWithoutRest({ key: testSchema(/^valid/), value: number() })
    );
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "keyValueSchema": Object {
          "propsSchemas": Object {
            "key": Object {
              "tester": /\\^valid/,
              "type": "Test",
            },
            "value": Object {
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
      Object {
        "type": "Positive",
      }
    `);
  });
  test("safeInteger", () => {
    const schema = safeInteger();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "type": "SafeInteger",
      }
    `);
  });
  test("string", () => {
    const schema = string();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "type": "String",
      }
    `);
  });
  test("symbol", () => {
    const schema = symbol();
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "type": "Symbol",
      }
    `);
  });
  test("testSchema", () => {
    const schema = testSchema(/^valid/);
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "tester": /\\^valid/,
        "type": "Test",
      }
    `);
  });
  test("variant", () => {
    const schema = variant([1, 2, 3, 4, 5]);
    const explanationSchema = schemaToExplanationSchema(schema);
    expect(explanationSchema).toMatchInlineSnapshot(`
      Object {
        "type": "Variant",
        "variants": Array [
          Object {
            "type": "Primitive",
            "value": 1,
          },
          Object {
            "type": "Primitive",
            "value": 2,
          },
          Object {
            "type": "Primitive",
            "value": 3,
          },
          Object {
            "type": "Primitive",
            "value": 4,
          },
          Object {
            "type": "Primitive",
            "value": 5,
          },
        ],
      }
    `);
  });
});
