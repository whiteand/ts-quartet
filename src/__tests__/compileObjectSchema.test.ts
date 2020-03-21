import { compileObjectSchema } from "../compileObjectSchema";
import { v } from "../index";
import { getDescription } from "./getDescription";

describe("compileObjectSchema", () => {
  test("empty obj", () => {
    const validator = compileObjectSchema(v, {});
    expect(getDescription(validator)).toMatchInlineSnapshot(`
                                                      Object {
                                                        "_": "function (value) { return value; }",
                                                        "explanations": Array [],
                                                      }
                                    `);
  });
  test("obj with func", () => {
    const validator = compileObjectSchema(v, {
      id: () => ({
        check: id => `${id} === 42`,
        not: id => `${id} !== 42`,
        handleError: (id, ctx) => `${ctx}.explanations.push(${id})`
      })
    });
    expect(validator({})).toBe(false);
    expect(validator.explanations).toEqual([undefined]);
    expect(validator(null)).toBe(false);
    expect(validator.explanations).toEqual([]);
    expect(validator({ id: 43 })).toBe(false);
    expect(validator.explanations).toEqual([43]);

    expect(getDescription(validator)).toMatchInlineSnapshot(`
                                                Object {
                                                  "_": "function validator(value) {
                                                    validator.explanations = []
                                                    if (!value) return false
                                                    if (value.id !== 42) {
                                                      validator.explanations.push(value.id)
                                                      return false
                                                    }
                                                    return true
                                                  }",
                                                  "__validValues": Object {},
                                                  "explanations": Array [
                                                    43,
                                                  ],
                                                }
                                `);
  });
  test("obj with constant", () => {
    const validator = compileObjectSchema(v, {
      id: 42,
      nan: NaN,
      inf: Infinity,
      minf: -Infinity,
      zero: -0,
      str: "Andrew",
      f: false,
      t: true,
      symb: Symbol.for("test")
    });
    expect(validator({})).toBe(false);
    expect(validator.explanations).toEqual([]);
    expect(validator(null)).toBe(false);
    expect(validator.explanations).toEqual([]);
    expect(validator({ id: 43 })).toBe(false);
    expect(validator.explanations).toEqual([]);
    expect(
      validator({
        id: 42,
        nan: NaN,
        inf: Infinity,
        minf: -Infinity,
        zero: 0,
        str: "Andrew",
        f: false,
        t: true,
        symb: Symbol.for("test")
      })
    ).toBe(true);
    expect(validator.explanations).toEqual([]);
    expect(validator({ id: "42" })).toBe(false);
    expect(validator.explanations).toEqual([]);

    expect(getDescription(validator)).toMatchInlineSnapshot(`
                        Object {
                          "_": "function validator(value) {
                            validator.explanations = []
                            if (!value) return false
                            if (!validator.__validValues.str[value.str]) return false
                            if (!validator.__validValues.symb[value.symb]) return false
                            if (value.id !== 42) return false
                            if (!Number.isNaN(value.nan)) return false
                            if (value.inf !== Infinity) return false
                            if (value.minf !== -Infinity) return false
                            if (value.zero !== 0) return false
                            if (value.f !== false) return false
                            if (value.t !== true) return false
                            return true
                          }",
                          "__validValues": Object {
                            "str": Object {
                              "Andrew": true,
                            },
                            "symb": Object {
                              Symbol(test): true,
                            },
                          },
                          "explanations": Array [],
                        }
                `);
  });
  test("obj with variants", () => {
    const validator = compileObjectSchema(v, {
      gender: ["male", "female"],
      grade: Array.from({ length: 11 }, (_, i) => i + 1)
    });

    expect(validator({})).toBe(false);
    expect(validator({ gender: "male" })).toBe(false);
    expect(validator({ grade: 10 })).toBe(false);
    expect(validator({ grade: "10" })).toBe(false);
    expect(validator({ gender: "male", grade: 0 })).toBe(false);
    expect(validator({ grade: 12, gender: "female" })).toBe(false);
    expect(validator({ grade: "10" })).toBe(false);
    expect(validator({ grade: "10", gender: "male" })).toBe(false);
    expect(validator({ grade: 10, gender: "male" })).toBe(true);

    expect(getDescription(validator)).toMatchInlineSnapshot(`
            Object {
              "_": "function validator(value) {
                validator.explanations = []
                if (!value) return false
                if (!validator['gender-0'](value.gender)) return false
                if (!validator['grade-0'](value.grade)) return false
                return true
              }",
              "__validValues": Object {},
              "explanations": Array [],
              "gender-0": "function validator(value) {
                if (validator.__validValuesDict[value] === true) return true
                return false
              }",
              "gender-0.__validValuesDict": Object {
                "female": true,
                "male": true,
              },
              "gender-0.explanations": Array [],
              "grade-0": "function validator(value) {
                if (value === 1) return true
                if (value === 2) return true
                if (value === 3) return true
                if (value === 4) return true
                if (value === 5) return true
                if (value === 6) return true
                if (value === 7) return true
                if (value === 8) return true
                if (value === 9) return true
                if (value === 10) return true
                if (value === 11) return true
                return false
              }",
              "grade-0.explanations": Array [],
            }
        `);
  });
  test("obj + obj", () => {
    const validator = compileObjectSchema(v, {
      deep: { deep: { space: "true" } }
    });
    expect(validator({ deep: { deep: { space: "false" } } })).toBe(false);
    expect(validator({ deep: { deep: { space: "true" } } })).toBe(true);
    expect(getDescription(validator)).toMatchInlineSnapshot(`
      Object {
        "_": "function validator(value) {
          validator.explanations = []
          if (!value) return false
          if (!validator['deep-1'](value.deep)) return false
          return true
        }",
        "__validValues": Object {},
        "deep-1": "function validator(value) {
          validator.explanations = []
          if (!value) return false
          if (!validator['deep-0'](value.deep)) return false
          return true
        }",
        "deep-1.__validValues": Object {},
        "deep-1.deep-0": "function validator(value) {
          validator.explanations = []
          if (!value) return false
          if (value.space !== 'true') return false
          return true
        }",
        "deep-1.deep-0.__validValues": Object {},
        "deep-1.deep-0.explanations": Array [],
        "deep-1.explanations": Array [],
        "explanations": Array [],
      }
    `);
  });
});
