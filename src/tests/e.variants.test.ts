import { e as v, ExplanationSchemaType } from "..";
import { getExplanations } from "./getExplanations";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v([...])", () => {
  test("v([])", () => {
    const validator = v([]);
    testValidatorImpure(
      validator,
      [],
      [null, false, [], {}, 1, 0, NaN, undefined, true]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: []
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, 1)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: 1
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, NaN)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: true
      }
    ]);
  });
  test("v([1])", () => {
    const validator = v([1]);
    testValidatorImpure(
      validator,
      [1],
      [null, false, [], {}, 0, NaN, undefined, true]
    );
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: []
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, NaN)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Primitive,
          value: 1
        },
        value: true
      }
    ]);
  });
  test("v([1, 2])", () => {
    const validator = v([1, 2]);
    testValidatorImpure(
      validator,
      [1, 2],
      ["2", "1", null, false, [], {}, 0, NaN, undefined, true]
    );
    expect(getExplanations(validator, "2")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: "2"
      }
    ]);
    expect(getExplanations(validator, "1")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: "1"
      }
    ]);
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: []
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, NaN)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: 2
            }
          ]
        },
        value: true
      }
    ]);
  });
  test("v([1, '2'])", () => {
    const validator = v([1, "2"]);
    testValidatorImpure(
      validator,
      [1, "2"],
      [2, "1", null, false, [], {}, 0, NaN, undefined, true]
    );
    expect(getExplanations(validator, 2)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: 2
      }
    ]);
    expect(getExplanations(validator, "1")).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: "1"
      }
    ]);
    expect(getExplanations(validator, null)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: []
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, NaN)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        path: [],
        schema: {
          type: ExplanationSchemaType.Variant,
          variants: [
            {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            }
          ]
        },
        value: true
      }
    ]);
  });
  test("v([true, false])", () => {
    let flag = true;
    const validator = v([
      v.any,
      v.custom(() => {
        flag = false;
        return false;
      })
    ]);
    validator(1);
    expect(flag).toBeTruthy();
  });
});
