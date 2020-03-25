import { compileObjectSchemaWithRest } from "../compileObjectSchemaWithRest";
import { v } from "../index";
import { getExplanatoryFunc } from "./getExplanatoryFunc";
import { snapshot, tables, getExplanation } from "./utils";

describe("compileObjectSchemaWithRest", () => {
  test("empty obj", () => {
    const validator = compileObjectSchemaWithRest(v, {
      [v.rest]: getExplanatoryFunc("A", "Is not A")
    });
    expect(getExplanation(validator, {})).toMatchInlineSnapshot(`Array []`);
    expect(getExplanation(validator, { a: "A" })).toMatchInlineSnapshot(
      `Array []`
    );
    expect(getExplanation(validator, { a: "A", b: "b" }))
      .toMatchInlineSnapshot(`
      Array [
        "Is not A",
      ]
    `);
    snapshot(validator);
  });
  test("obj with func", () => {
    const validator = compileObjectSchemaWithRest(v, {
      id: () => ({
        check: id => `${id} === 42`,
        not: id => `${id} !== 42`,
        handleError: (id, ctx) => `${ctx}.explanations.push(${id})`
      }),
      [v.rest]: getExplanatoryFunc("A", "Is not A")
    });
    expect(validator.pure).toBe(false);
    tables(
      validator,
      [{ id: 42 }, { id: 42, other: "A" }],
      [
        {},
        { id: 42, other: "B" },
        { id: "42" },
        null,
        false,
        true,
        { id: false },
        "41 + 1"
      ]
    );
    expect(getExplanation(validator, { id: 43 })).toEqual([43]);
    expect(getExplanation(validator, { id: 42, other: "b" })).toEqual([
      "Is not A"
    ]);
    snapshot(validator);
  });
  test("obj with constant", () => {
    const validator = compileObjectSchemaWithRest(v, {
      id: 42,
      nan: NaN,
      inf: Infinity,
      minf: -Infinity,
      zero: -0,
      str: "Andrew",
      f: false,
      t: true,
      symb: Symbol.for("test"),
      [v.rest]: v.string
    });
    expect(validator.pure).toBe(true);
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
        {
          id: 42,
          nan: NaN,
          inf: Infinity,
          minf: -Infinity,
          zero: 0,
          str: "Andrew",
          f: false,
          t: true,
          symb: Symbol.for("test"),
          other: 10
        },
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
    const validator = compileObjectSchemaWithRest(v, {
      gender: ["male", "female"],
      grade: Array.from({ length: 11 }, (_, i) => i + 1),
      [v.rest]: [
        getExplanatoryFunc("A", "Is not A"),
        getExplanatoryFunc("B", "Is not B")
      ]
    });
    expect(validator.pure).toBe(false);

    const invalids = [
      {},
      { gender: "male" },
      { grade: 10 },
      { grade: "10" },
      { gender: "male", grade: 0 },
      { grade: 12, gender: "female" },
      { grade: "10" },
      { grade: "10", gender: "male" },
      { grade: 10, gender: "male", other: "a" }
    ];
    const valids = ([] as any).concat(
      ...["male", "female"].map(gender =>
        Array.from({ length: 11 }, (_, grade) => ({
          grade: grade + 1,
          gender,
          test: "A",
          other: "B"
        }))
      )
    );
    tables(validator, valids, invalids);
    expect(getExplanation(validator, { grade: 10, gender: "male", other: "a" }))
      .toMatchInlineSnapshot(`
                                    Array [
                                      "Is not A",
                                      "Is not B",
                                    ]
                        `);
    snapshot(validator);
  });
  test("obj + obj", () => {
    const validator = compileObjectSchemaWithRest(v, {
      deep: {
        deep: {
          space: () => ({
            check: v => `${v} === 'true'`,
            handleError: (v, ctx) => `${ctx}.explanations.push(${v})`
          }),
          [v.rest]: getExplanatoryFunc("A", "Is not A")
        },
        [v.rest]: getExplanatoryFunc("B", "Is not B")
      }
    });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [
        { deep: { deep: { space: "true", other: "A" } } },
        { deep: { deep: { space: "true" } } },
        { deep: { deep: { space: "true", other: "A" }, yetAnother: "B" } }
      ],
      [
        { deep: { deep: { space: "false" } } },
        { deep: { deep: { space: "true", other: "b" } } },
        { deep: { deep: { space: "true", other: "A" }, yetAnother: "c" } },
        { deep: { deep: { space: "true", other: "a" }, yetAnother: "B" } }
      ]
    );
    expect(getExplanation(validator, { deep: { deep: { space: "false" } } }))
      .toMatchInlineSnapshot(`
                                                                        Array [
                                                                          "false",
                                                                        ]
                                                `);
    expect(
      getExplanation(validator, {
        deep: { deep: { space: "true" }, other: "b" }
      })
    ).toMatchInlineSnapshot(`
      Array [
        "Is not B",
      ]
    `);
    expect(
      getExplanation(validator, {
        deep: { deep: { space: "true", other: "a" } }
      })
    ).toMatchInlineSnapshot(`
      Array [
        "Is not A",
      ]
    `);
  });
  test("obj: variant explanations", () => {
    const validator = compileObjectSchemaWithRest(v, {
      var: [
        getExplanatoryFunc("A", "Is not A"),
        getExplanatoryFunc("B", "Is not B")
      ],
      [v.rest]: getExplanatoryFunc("C", "Is not C")
    });
    expect(validator.pure).toBe(false);
    tables(
      validator,
      [{ var: "A" }, { var: "B" }, { var: "A", b: "C" }],
      [{ var: "C" }, { var: "A", B: "d" }, { var: "B", b: "d" }]
    );
    expect(getExplanation(validator, { var: "a" })).toMatchInlineSnapshot(`
                        Array [
                          "Is not A",
                          "Is not B",
                        ]
                `);
    expect(getExplanation(validator, { var: "A", b: "d" }))
      .toMatchInlineSnapshot(`
      Array [
        "Is not C",
      ]
    `);
    expect(getExplanation(validator, { var: "B", b: "d" }))
      .toMatchInlineSnapshot(`
      Array [
        "Is not C",
      ]
    `);
    snapshot(validator);
  });
  test("obj: variants explanations", () => {
    const validator = v([
      null,
      {
        a: getExplanatoryFunc("A", "Is not A"),
        [v.rest]: getExplanatoryFunc("C", "Is not C")
      }
    ]);
    expect(validator.pure).toBe(false);

    tables(
      validator,
      [null, { a: "A" }, { a: "A", b: "C" }],
      [
        false,
        undefined,
        0,
        { a: "A", b: "c" },
        { a: "b" },
        { a: "a" },
        { a: "a" }
      ]
    );
    expect(getExplanation(validator, { a: "b" })).toMatchInlineSnapshot(`
                                                      Array [
                                                        "Is not A",
                                                      ]
                                    `);
    expect(getExplanation(validator, { a: "A" })).toMatchInlineSnapshot(
      `Array []`
    );
    expect(getExplanation(validator, { a: "A", b: "C" })).toMatchInlineSnapshot(
      `Array []`
    );
    expect(getExplanation(validator, { a: "A", b: "c" }))
      .toMatchInlineSnapshot(`
      Array [
        "Is not C",
      ]
    `);
  });
});
