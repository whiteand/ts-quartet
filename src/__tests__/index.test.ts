import { c, v, FunctionSchema } from "../index";
const uniqId = (() => {
  let counter = 0;
  return (prefix: string) => {
    return `${prefix}-${counter++}`;
  };
})();
const toPairs = (value: any) => (value ? (Object as any).entries(value) : []);
function getDescription(validator: any) {
  if (!validator) return {};

  return (Object as any)
    .entries(validator)
    .flatMap(([key, value]: any[]) => [
      [key, typeof value === "function" ? value.toString().trim() : value],
      ...(typeof value === "function"
        ? toPairs(getDescription(value)).map(([key2, value]: any[]) => [
            key + key2,
            value
          ])
        : [])
    ])
    .reduce((dict: any, [k, desc]: any[]) => {
      dict[k] = desc;
      return dict;
    }, {});
}
const evenIdSchema = (
  isEvenNumberMethodName: string
): FunctionSchema => () => ({
  prepare: ctx => {
    ctx[isEvenNumberMethodName] = (n: number) => n % 2 === 0;
  },
  check: (valueId: string, ctxId: string) =>
    `${valueId} && ${ctxId}['${isEvenNumberMethodName}'](${valueId}.id)`,
  not: (valueId: string, ctxId: string) =>
    `!${valueId} || !${ctxId}['${isEvenNumberMethodName}'](${valueId}.id)`,
  handleError: (valueId: string, ctxId: string) =>
    `
    ${ctxId}.explanations.push({ type: 'IdIsNotAnEvenNumber', value: ${valueId} })
    `.trim()
});
describe("c", () => {
  test("to be function", () => {
    expect(typeof c).toBe("function");
  });
  test("function schema compilation without handle and prepare", () => {
    const validator = c(v.number);
    expect(validator.toString()).toMatchInlineSnapshot(`
                  "function validator(value) {
                      validator.explanations = []
                      return typeof value === 'number'
                    }"
            `);
    expect(validator("1")).toBe(false);
    expect(validator(undefined)).toBe(false);
    expect(validator(0)).toBe(true);
    expect(validator(NaN)).toBe(true);
    expect(validator(Infinity)).toBe(true);
    expect(validator(-Infinity)).toBe(true);
    expect(validator.explanations).toEqual([]);
  });
  test("function schema compilation without handle", () => {
    const isEvenNumberMethodName = uniqId("isEvenNumber");
    const validator = c(() => ({
      prepare: ctx => {
        ctx[isEvenNumberMethodName] = (n: number) => n % 2 === 0;
      },
      check: (valueId: string, ctxId: string) =>
        `${valueId} ? ${ctxId}['${isEvenNumberMethodName}'](${valueId}.id) : false`
    }));
    expect(validator.toString()).toMatchInlineSnapshot(`
                  "function validator(value) {
                      validator.explanations = []
                      return value ? validator['isEvenNumber-0'](value.id) : false
                    }"
            `);
    expect(validator({ id: 1 })).toBe(false);
    expect(validator({ id: 2 })).toBe(true);
    expect(validator({})).toBe(false);
    expect(validator(null)).toBe(false);
    expect(validator.explanations).toMatchInlineSnapshot(`Array []`);
  });
  test("function schema compilation", () => {
    const isEvenNumberMethodName = uniqId("isEvenNumber");
    const validator = c(evenIdSchema("isEven"));
    expect(validator.toString()).toMatchInlineSnapshot(`
                  "function validator(value) {
                      validator.explanations = []
                      if (value && validator['isEven'](value.id)) {
                        return true
                      }
                      validator.explanations.push({ type: 'IdIsNotAnEvenNumber', value: value })
                      return false
                    }"
            `);
    expect(validator({ id: 1 })).toBe(false);
    expect(validator({ id: 2 })).toBe(true);
    expect(validator({})).toBe(false);
    expect(validator(null)).toBe(false);
    expect(validator.explanations).toMatchInlineSnapshot(`
                                                                                                            Array [
                                                                                                              Object {
                                                                                                                "type": "IdIsNotAnEvenNumber",
                                                                                                                "value": null,
                                                                                                              },
                                                                                                            ]
                                                                        `);
  });
  test("constant symbol", () => {
    const nameSymbol = Symbol.for("name");
    const validator = c(nameSymbol);
    expect(validator.toString().trim()).toMatchInlineSnapshot(
      `"function (value) { return value === c; }"`
    );
    expect(validator(Symbol.for("name"))).toBe(true);
    expect(validator(Symbol())).toBe(false);
    expect(validator(false)).toBe(false);
  });
  test("constant number", () => {
    const value = 1;
    const validator = c(value);
    expect(validator.toString().trim()).toMatchInlineSnapshot(
      `"function (value) { return value === c; }"`
    );
    expect(validator(1)).toBe(true);
    expect(validator("1")).toBe(false);
  });
  test("constant string", () => {
    const value = "string";
    const validator = c(value);
    expect(validator.toString().trim()).toMatchInlineSnapshot(
      `"function (value) { return value === c; }"`
    );
    expect(validator(value)).toBe(true);
    expect(validator(value + value)).toBe(false);
  });
  test("constant boolean", () => {
    const value = true;
    const validator = c(value);
    expect(validator.toString().trim()).toMatchInlineSnapshot(
      `"function (value) { return value === c; }"`
    );
  });
  test("variants", () => {
    const schema = [null, v.string, [1, 2, 3], evenIdSchema("isEven")];
    const validator = c(schema);
    expect(validator.toString().trim()).toMatchInlineSnapshot(`
            "function validator(value) {
                if (validator.__validValuesDict[value] === true) return true
                if (value === null) return true
                if (typeof value === 'string') return true;
                if (value && validator['isEven'](value.id)) return true;
                validator.explanations.push({ type: 'IdIsNotAnEvenNumber', value: value })
                return false
              }"
        `);
    expect(getDescription(validator)).toMatchInlineSnapshot(`
                                    Object {
                                      "__validValuesDict": Object {
                                        "1": true,
                                        "2": true,
                                        "3": true,
                                      },
                                      "isEven": "function (n) { return n % 2 === 0; }",
                                    }
                        `);
  });
  test("object function", () => {
    const isThirteen: FunctionSchema = () => ({
      check: valueId => `${valueId} === 13`,
      not: valueId => `${valueId} !== 13`,
      handleError: valueId => `console.log(${valueId})`
    });
    const validator = c({
      id: isThirteen
    });
    expect(validator.toString()).toMatchInlineSnapshot(`
      "function validator(value) {
          if (!value) return false
          validator.explanations = []
          if (value.id !== 13) {
            console.log(value.id)
            return false
          }
          return true
        }"
    `);
    expect(getDescription(validator)).toMatchInlineSnapshot(`
                                                Object {
                                                  "__validValues": Object {},
                                                  "explanations": Array [],
                                                }
                                `);
  });
  test("object function with constant", () => {
    const isThirteen: FunctionSchema = () => ({
      check: valueId => `${valueId} === 13`,
      not: valueId => `${valueId} !== 13`
    });
    const validator = c({
      id: isThirteen,
      answer: 42
    });
    expect(validator.toString()).toMatchInlineSnapshot(`
      "function validator(value) {
          if (!value) return false
          validator.explanations = []
          if (!validator.__validValues.answer[value.answer]) return false
          if (value.id !== 13) return false
          return true
        }"
    `);
    expect(getDescription(validator)).toMatchInlineSnapshot(`
                                                Object {
                                                  "__validValues": Object {
                                                    "answer": Object {
                                                      "42": true,
                                                    },
                                                  },
                                                  "explanations": Array [],
                                                }
                                `);
  });
  test("object function with variants", () => {
    const validator = c({
      answer: 42,
      gender: ["male", "female"],
      isStudent: [true, false]
    });
    expect(validator.toString()).toMatchInlineSnapshot(`
      "function validator(value) {
          if (!value) return false
          validator.explanations = []
          if (!validator.__validValues.answer[value.answer]) return false
          if (!validator['gender-0'](value.gender)) return false
          if (!validator['isStudent-0'](value.isStudent)) return false
          return true
        }"
    `);
    expect(getDescription(validator)).toMatchInlineSnapshot(`
            Object {
              "__validValues": Object {
                "answer": Object {
                  "42": true,
                },
              },
              "explanations": Array [],
              "gender-0": "function validator(value) {
                if (validator.__validValuesDict[value] === true) return true
                return false
              }",
              "gender-0__validValuesDict": Object {
                "female": true,
                "male": true,
              },
              "isStudent-0": "function validator(value) {
                if (value === true) return true
                if (value === false) return true
                return false
              }",
            }
        `);

    expect(validator({})).toBe(false);
    expect(validator({ id: 1 })).toBe(false);
    expect(validator({ id: 1, answer: 42 })).toBe(false);
    expect(validator({ id: 1, answer: 42, gender: "male" })).toBe(false);
    expect(
      validator({ id: 1, answer: 42, gender: "male", isStudent: true })
    ).toBe(true);
  });

  test("nested objects", () => {
    const isPerson = c({
      name: v.string,
      age: v.number,
      gender: ["male", "female"],
      wife: [null, { name: v.string, age: v.number, gender: "female" }],
      husband: [null, { name: v.string, age: v.number, gender: "male" }]
    });
    expect(isPerson.toString().trim()).toMatchInlineSnapshot(`
      "function validator(value) {
          if (!value) return false
          validator.explanations = []
          if (typeof value.name !== 'string') return false
          if (typeof value.age !== 'number') return false
          if (!validator['gender-1'](value.gender)) return false
          if (!validator['wife-0'](value.wife)) return false
          if (!validator['husband-0'](value.husband)) return false
          return true
        }"
    `);
    const subvalidators = getDescription(isPerson);
    expect(getDescription(isPerson)).toMatchInlineSnapshot(`
      Object {
        "__validValues": Object {},
        "explanations": Array [],
        "gender-1": "function validator(value) {
          if (validator.__validValuesDict[value] === true) return true
          return false
        }",
        "gender-1__validValuesDict": Object {
          "female": true,
          "male": true,
        },
        "husband-0": "function validator(value) {
          if (value === null) return true
          if (validator['variant-1-1'](value)) return true;
          validator.explanations.push(...validator['variant-1-1'].explanations)
          return false
        }",
        "husband-0variant-1-1": "function validator(value) {
          if (!value) return false
          validator.explanations = []
          if (!validator.__validValues.gender[value.gender]) return false
          if (typeof value.name !== 'string') return false
          if (typeof value.age !== 'number') return false
          return true
        }",
        "husband-0variant-1-1__validValues": Object {
          "gender": Object {
            "male": true,
          },
        },
        "husband-0variant-1-1explanations": Array [],
        "wife-0": "function validator(value) {
          if (value === null) return true
          if (validator['variant-1-0'](value)) return true;
          validator.explanations.push(...validator['variant-1-0'].explanations)
          return false
        }",
        "wife-0variant-1-0": "function validator(value) {
          if (!value) return false
          validator.explanations = []
          if (!validator.__validValues.gender[value.gender]) return false
          if (typeof value.name !== 'string') return false
          if (typeof value.age !== 'number') return false
          return true
        }",
        "wife-0variant-1-0__validValues": Object {
          "gender": Object {
            "female": true,
          },
        },
        "wife-0variant-1-0explanations": Array [],
      }
    `);
  });
});
