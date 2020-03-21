import { compileObjectSchema } from "../compileObjectSchema";
import { v } from "../index";
import { getExplanatoryFunc } from "./getExplanatoryFunc";
import { snapshot, tables, getExplanation } from "./utils";

describe("compileObjectSchema", () => {
  test("empty obj", () => {
    const validator = compileObjectSchema(v, {});
    snapshot(validator);
  });
  test("obj with func", () => {
    const validator = compileObjectSchema(v, {
      id: () => ({
        check: id => `${id} === 42`,
        not: id => `${id} !== 42`,
        handleError: (id, ctx) => `${ctx}.explanations.push(${id})`
      })
    });
    tables(
      validator,
      [{ id: 42 }],
      [{}, { id: "42" }, null, false, true, { id: false }, "41 + 1"]
    );
    expect(getExplanation(validator, { id: 43 })).toEqual([43]);
    snapshot(validator);
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
    tables(
      validator,
      [
        {
          id: 42,
          nan: NaN,
          inf: Infinity,
          minf: -Infinity,
          zero: 0,
          str: "Andrew",
          f: false,
          t: true,
          symb: Symbol.for("test")
        }
      ],
      [
        null,
        {},
        {
          id: "42",
          nan: NaN,
          inf: Infinity,
          minf: -Infinity,
          zero: 0,
          str: "Andrew",
          f: false,
          t: true,
          symb: Symbol.for("test")
        },
        {
          id: 42,
          nan: "NaN",
          inf: Infinity,
          minf: -Infinity,
          zero: 0,
          str: "Andrew",
          f: false,
          t: true,
          symb: Symbol.for("test")
        },
        {
          id: 42,
          nan: NaN,
          inf: "Infinity",
          minf: -Infinity,
          zero: 0,
          str: "Andrew",
          f: false,
          t: true,
          symb: Symbol.for("test")
        },
        {
          id: 42,
          nan: NaN,
          inf: Infinity,
          minf: "-Infinity",
          zero: 0,
          str: "Andrew",
          f: false,
          t: true,
          symb: Symbol.for("test")
        },
        {
          id: 42,
          nan: NaN,
          inf: Infinity,
          minf: -Infinity,
          zero: "0",
          str: "Andrew",
          f: false,
          t: true,
          symb: Symbol.for("test")
        },
        {
          id: 42,
          nan: NaN,
          inf: Infinity,
          minf: -Infinity,
          zero: 0,
          str: "",
          f: false,
          t: true,
          symb: Symbol.for("test")
        },
        {
          id: 42,
          nan: NaN,
          inf: Infinity,
          minf: -Infinity,
          zero: 0,
          str: "Andrew",
          f: null,
          t: true,
          symb: Symbol.for("test")
        },
        {
          id: 42,
          nan: NaN,
          inf: Infinity,
          minf: -Infinity,
          zero: 0,
          str: "Andrew",
          f: false,
          t: 1,
          symb: Symbol.for("test")
        },
        {
          id: 42,
          nan: NaN,
          inf: Infinity,
          minf: -Infinity,
          zero: 0,
          str: "Andrew",
          f: false,
          t: true,
          symb: "test"
        }
      ]
    );

    snapshot(validator);
  });
  test("obj with variants", () => {
    const validator = compileObjectSchema(v, {
      gender: ["male", "female"],
      grade: Array.from({ length: 11 }, (_, i) => i + 1)
    });

    const invalids = [
      {},
      { gender: "male" },
      { grade: 10 },
      { grade: "10" },
      { gender: "male", grade: 0 },
      { grade: 12, gender: "female" },
      { grade: "10" },
      { grade: "10", gender: "male" }
    ];
    const valids = ([] as any).concat(
      ...["male", "female"].map(gender =>
        Array.from({ length: 11 }, (_, grade) => ({ grade: grade + 1, gender }))
      )
    );
    tables(validator, valids, invalids);
    snapshot(validator);
  });
  test("obj + obj", () => {
    const validator = compileObjectSchema(v, {
      deep: {
        deep: {
          space: () => ({
            check: v => `${v} === 'true'`,
            handleError: (v, ctx) => `${ctx}.explanations.push(${v})`
          })
        }
      }
    });
    tables(
      validator,
      [{ deep: { deep: { space: "true" } } }],
      [{ deep: { deep: { space: "false" } } }]
    );
    expect(getExplanation(validator, { deep: { deep: { space: "false" } } }))
      .toMatchInlineSnapshot(`
                              Array [
                                "false",
                              ]
                    `);
    snapshot(validator);
  });
  test("obj: variant explanations", () => {
    const validator = compileObjectSchema(v, {
      var: [
        getExplanatoryFunc("A", "Is not A"),
        getExplanatoryFunc("B", "Is not B")
      ]
    });
    expect(validator({ var: "a" })).toBe(false);
    expect(validator.explanations).toMatchInlineSnapshot(`
                                        Array [
                                          "Is not A",
                                          "Is not B",
                                        ]
                            `);
    expect(validator({ var: "B" })).toBe(true);
    expect(validator.explanations).toMatchInlineSnapshot(`Array []`);
    snapshot(validator);
  });
  test("obj: variants explanations", () => {
    const validator = v([null, { a: getExplanatoryFunc("A", "Is not A") }]);
    tables(
      validator,
      [null, { a: "A" }, { a: "A", b: "c" }],
      [false, undefined, 0, { a: "b" }, { a: "a" }, { a: "a" }]
    );
    expect(getExplanation(validator, { a: "b" })).toMatchInlineSnapshot(`
            Array [
              "Is not A",
            ]
        `);
    expect(getExplanation(validator, { a: "A" })).toMatchInlineSnapshot(
      `Array []`
    );
  });
});
