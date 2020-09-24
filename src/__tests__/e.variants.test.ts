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
        innerExplanations: [],
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: null
      }
    ]);
    expect(getExplanations(validator, false)).toEqual([
      {
        innerExplanations: [],
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: false
      }
    ]);
    expect(getExplanations(validator, [])).toEqual([
      {
        innerExplanations: [],
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: []
      }
    ]);
    expect(getExplanations(validator, {})).toEqual([
      {
        innerExplanations: [],
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: {}
      }
    ]);
    expect(getExplanations(validator, 1)).toEqual([
      {
        innerExplanations: [],
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: 1
      }
    ]);
    expect(getExplanations(validator, 0)).toEqual([
      {
        innerExplanations: [],
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: 0
      }
    ]);
    expect(getExplanations(validator, NaN)).toEqual([
      {
        innerExplanations: [],
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: NaN
      }
    ]);
    expect(getExplanations(validator, undefined)).toEqual([
      {
        innerExplanations: [],
        path: [],
        schema: {
          type: ExplanationSchemaType.Never
        },
        value: undefined
      }
    ]);
    expect(getExplanations(validator, true)).toEqual([
      {
        innerExplanations: [],
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
        innerExplanations: [],
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
        innerExplanations: [],
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
        innerExplanations: [],
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
        innerExplanations: [],
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
        innerExplanations: [],
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
        innerExplanations: [],
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
        innerExplanations: [],
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
        innerExplanations: [],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: "2"
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: "2"
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: "1"
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: "1"
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: null
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: null
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: false
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: false
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: []
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: []
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: {}
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: {}
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: 0
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: 0
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: NaN
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: NaN
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: undefined
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: undefined
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: true
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: true
          }
        ],
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
  test("{ a: [1, 2] }", () => {
    const validator = v({ a: [1, 2] });
    testValidatorImpure(
      validator,
      [{ a: 1 }, { a: 2 }],
      ["2", "1", null, false, [], {}, 0, NaN, undefined, true].map(a => ({ a }))
    );
    expect(getExplanations(validator, { a: "2" })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: "2"
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: "2"
          }
        ],
        path: ["a"],
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
    expect(getExplanations(validator, { a: "1" })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: "1"
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: "1"
          }
        ],
        path: ["a"],
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
    expect(getExplanations(validator, { a: null })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: null
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: null
          }
        ],
        path: ["a"],
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
    expect(getExplanations(validator, { a: false })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: false
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: false
          }
        ],
        path: ["a"],
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
    expect(getExplanations(validator, { a: [] })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: []
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: []
          }
        ],
        path: ["a"],
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
    expect(getExplanations(validator, { a: {} })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: {}
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: {}
          }
        ],
        path: ["a"],
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
    expect(getExplanations(validator, { a: 0 })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: 0
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: 0
          }
        ],
        path: ["a"],
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
    expect(getExplanations(validator, { a: NaN })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: NaN
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: NaN
          }
        ],
        path: ["a"],
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
    expect(getExplanations(validator, { a: undefined })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: undefined
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: undefined
          }
        ],
        path: ["a"],
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
    expect(getExplanations(validator, { a: true })).toEqual([
      {
        innerExplanations: [
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: true
          },
          {
            innerExplanations: [],
            path: ["a"],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 2
            },
            value: true
          }
        ],
        path: ["a"],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: 2
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: 2
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: "1"
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: "1"
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: null
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: null
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: false
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: false
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: []
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: []
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: {}
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: {}
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: 0
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: 0
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: NaN
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: NaN
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: undefined
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: undefined
          }
        ],
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
        innerExplanations: [
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: 1
            },
            value: true
          },
          {
            innerExplanations: [],
            path: [],
            schema: {
              type: ExplanationSchemaType.Primitive,
              value: "2"
            },
            value: true
          }
        ],
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
