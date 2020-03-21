import { c, v, FunctionSchema } from "../index";
const uniqId = (() => {
  let counter = 0;
  return (prefix: string) => {
    return `${prefix}-${counter++}`;
  };
})();
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

                              if (validator.validValuesDict[value] === true) return true
                        if (value === null) return true
                        if (typeof value === 'string') return true;

                        if (value && validator['isEven'](value.id)) return true;
                        validator.explanations.push({ type: 'IdIsNotAnEvenNumber', value: value })
                              return false
                            }"
                `);
    expect({ ...validator }).toMatchInlineSnapshot(`
                        Object {
                          "isEven": [Function],
                          "validValuesDict": Object {
                            "1": true,
                            "2": true,
                            "3": true,
                          },
                        }
                `);
  });
  test("object function", () => {
    const isThirteen: FunctionSchema = () => ({
      check: valueId => `${valueId} === 13`,
      not: valueId => `${valueId} !== 13`
    });
    const validator = c({
      id: isThirteen
    });
    expect(validator.toString()).toMatchInlineSnapshot(`
                  "function validator(value) {
                          if (!value) return false
                  validator.explanations = []
                  if (value.id !== 13) return false

                          return true
                        }"
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
    expect({ ...validator }).toMatchInlineSnapshot(`
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
});
