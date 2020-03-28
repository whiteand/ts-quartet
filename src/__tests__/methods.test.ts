import { v } from "../index";
import { snapshot, puretables, tables } from "./utils";
import { primitives } from "./mocks";

describe("methods", () => {
  test("and", () => {
    expect(typeof v.and).toBe("function");
    const validator = v(v.and(v.number, v.custom(e => e % 2 === 0)));
    snapshot(validator);
    puretables(
      validator,
      [2, 4, 6, 8],
      [
        "2",
        "4",
        "6",
        ...primitives.filter(e => typeof e !== "number"),
        1,
        3,
        5,
        7,
        9
      ]
    );
  });
  test("arrayOf", () => {
    expect(typeof v.arrayOf).toBe("function");
    const validator = v(v.arrayOf(v.number));
    snapshot(validator);
    const valids = [[], [1], [1, 2, 3.14]];
    const invalids = [["1"], ...primitives];
    puretables(validator, valids, invalids);
    puretables(
      v(v.and(v.arrayOf(v.number), v.arrayOf(v.number))),
      valids,
      invalids
    );
    puretables(
      v({ arr: v.arrayOf(v.number) }),
      valids.map(arr => ({ arr })),
      invalids.map(arr => ({ arr }))
    );
    tables(
      v({
        arr: v.custom(v(v.arrayOf(v.custom(v(v.number), "NaN"))), (v: any, errs?: any[]) => {
          return (errs && errs[0]) || 'Arr'
        })
      }),
      valids.map(arr => ({ arr })),
      invalids.map(arr => [{ arr }, Array.isArray(arr) ? ["NaN"] : ["Arr"]])
    );
    puretables(v([v.arrayOf(v.number), v.arrayOf(v.number)]), valids, invalids);
    tables(
      v(
        v.and(
          [
            v.arrayOf(v.custom(v(v.number), "NaN")),
            v.arrayOf(v.custom(v(v.number), "NaN"))
          ],
          v.arrayOf(v.custom(v(v.number), "NaN")),
          v.arrayOf(v.number)
        )
      ),
      valids,
      invalids.map(e => [e, Array.isArray(e) ? ["NaN", "NaN"] : []])
    );
  });
  test("boolean", () => {
    expect(typeof v.boolean).toBe("function");
    const validator = v(v.boolean);
    snapshot(validator);
    const valids = [true, false];
    const invalids = [
      ...primitives.filter(e => typeof e !== "boolean"),
      [],
      {}
    ];
    puretables(validator, valids, invalids);
    puretables(v(v.and(v.boolean, v.boolean)), valids, invalids);
  });
  test("compileAnd", () => {
    expect(typeof v.compileAnd).toBe("function");
  });
  test("compileArrayOf", () => {
    expect(typeof v.compileArrayOf).toBe("function");
  });
  test("custom", () => {
    expect(typeof v.custom).toBe("function");
    const validator = v(v.custom(v(v.custom(v(v.number), "NaN"))));
    expect(validator.pure).toBe(false);
    tables(
      validator,
      [1, 2, 3, 4],
      ["1", "2", undefined, false, null, {}, []].map(
        e => [e, ["NaN"]] as [any, any[]]
      )
    );
    const validator2 = v(
      v.custom(v(v.custom(v(v.number), (v: any) => ({ v }))))
    );
    snapshot(validator2);
    expect(validator2.pure).toBe(false);
    tables(
      validator2,
      [1, 2, 3, 4],
      ["1", "2", undefined, false, null, {}, []].map(
        e => [e, [{ v: e }]] as [any, any[]]
      )
    );
  });
  test("function", () => {
    expect(typeof v.function).toBe("function");
    const validator = v(v.function);
    snapshot(validator);
    puretables(validator, [() => {}, function() {}], [...primitives, [], {}]);
    const validator2 = v({ a: v.function });
    snapshot(validator2);
    puretables(
      validator2,
      [() => {}, function() {}].map(a => ({ a })),
      [...primitives, [], {}].map(a => ({
        a
      }))
    );
  });
  test("max exclusive", () => {
    expect(typeof v.max).toBe("function");
    const validator = v(v.max(5, true));
    const valids = [1, 2, 3, 4, -Infinity];
    const invalids = [5, 6, 7, 8, 9, 5.1, Infinity];
    puretables(validator, valids, invalids);
    puretables(v(v.and(v.max(5, true), v.max(5, true))), valids, invalids);
    snapshot(validator);
  });
  test("max inclusive", () => {
    const validator = v(v.max(5));
    const valids = [1, 2, 3, 4, -Infinity, 5];
    const invalids = [6, 7, 8, 9, 5.1, Infinity];
    puretables(validator, valids, invalids);
    puretables(v(v.and(v.max(5), v.max(5))), valids, invalids);
    snapshot(validator);
  });
  test("maxLength exclusive", () => {
    expect(typeof v.maxLength).toBe("function");
    const validator = v(v.maxLength(5, true));
    const valids = [
      "1234",
      ...[1, 2, 3, 4].map(length => Array.from({ length }, () => 1))
    ];
    const invalids = [
      "12345",
      ...[6, 7, 8, 9, 5].map(length => Array.from({ length }, () => 1)),
      "123456"
    ];
    puretables(validator, valids, invalids);
    puretables(
      v(v.and(v.maxLength(5, true), v.maxLength(5, true))),
      valids,
      invalids
    );
    snapshot(validator);
  });
  test("maxLength inclusive", () => {
    const validator = v(v.maxLength(5));
    const valids = [
      "1234",
      "12345",
      ...[1, 2, 3, 4, 5].map(length => Array.from({ length }, () => 1))
    ];
    const invalids = [
      ...[6, 7, 8, 9].map(length => Array.from({ length }, () => 1)),
      "123456"
    ];
    puretables(validator, valids, invalids);
    puretables(v(v.and(v.maxLength(5), v.maxLength(5))), valids, invalids);
    snapshot(validator);
  });
  test("min exclusive", () => {
    expect(typeof v.min).toBe("function");
    const validator = v(v.min(5, true));
    const valids = [6, 7, 8, 9, 5.1, Infinity];
    const invalids = [1, 2, 3, 4, 5, -Infinity];
    puretables(validator, valids, invalids);
    puretables(v(v.and(v.min(5, true), v.min(5, true))), valids, invalids);
    snapshot(validator);
  });
  test("min inclusive", () => {
    expect(typeof v.min).toBe("function");
    const validator = v(v.min(5));
    const valids = [5, 6, 7, 8, 9, 5.1, Infinity];
    const invalids = [1, 2, 3, 4, -Infinity];
    puretables(validator, valids, invalids);
    puretables(v(v.and(v.min(5), v.min(5))), valids, invalids);
    snapshot(validator);
  });
  test("minLength exclusive", () => {
    expect(typeof v.minLength).toBe("function");
    const validator = v(v.minLength(5, true));
    puretables(
      validator,
      [
        ...[6, 7, 8, 9].map(length => Array.from({ length }, () => 1)),
        "123456"
      ],
      [
        "12345",
        "1234",
        ...[1, 2, 3, 4, 5].map(length => Array.from({ length }, () => 1))
      ]
    );
    snapshot(validator);
    const validator2 = v(v.and(v.minLength(5, true), v.minLength(5, true)));
    snapshot(validator2);
    puretables(
      validator2,
      [
        ...[6, 7, 8, 9].map(length => Array.from({ length }, () => 1)),
        "123456"
      ],
      [
        "12345",
        "1234",
        ...[1, 2, 3, 4, 5].map(length => Array.from({ length }, () => 1))
      ]
    );
  });
  test("minLength inclusive", () => {
    expect(typeof v.minLength).toBe("function");
    const validator = v(v.minLength(5));
    const valids = [
      ...[6, 7, 8, 9].map(length => Array.from({ length }, () => 1)),
      "123456",
      "12345"
    ];
    const invalids = [
      "1234",
      ...[1, 2, 3, 4].map(length => Array.from({ length }, () => 1))
    ];
    puretables(validator, valids, invalids);
    puretables(v(v.and(v.minLength(5), v.minLength(5))), valids, invalids);
    snapshot(validator);
  });
  test("negative", () => {
    expect(typeof v.negative).toBe("function");
    const validator = v(v.negative);
    snapshot(validator);
    puretables(validator, [-1, -2, -Infinity], [0, -0, 1, 2, 3, 4, Infinity]);
    const validator2 = v(v.and(v.negative, v.negative));
    snapshot(validator2);
    puretables(validator2, [-1, -2, -Infinity], [0, -0, 1, 2, 3, 4, Infinity]);
  });
  test("number", () => {
    expect(typeof v.number).toBe("function");
    const validator = v(v.number);
    snapshot(validator);
    puretables(
      validator,
      [-1, -2, -Infinity, NaN, 0, -0, 1, 2, 3, 4, Infinity],
      [...primitives.filter(e => typeof e !== "number"), {}, []]
    );
    const validator2 = v({ a: v.number });
    snapshot(validator2);
    puretables(
      validator2,
      [...primitives.filter(e => typeof e === "number").map(a => ({ a }))],
      [...primitives.filter(e => typeof e !== "number"), [], {}].map(a => ({
        a
      }))
    );
  });
  test("not", () => {
    expect(typeof v.not).toBe("function");
  });
  test("positive", () => {
    expect(typeof v.positive).toBe("function");
    const validator = v(v.positive);
    snapshot(validator);
    puretables(validator, [1, 2, Infinity], [0, -0, -1, -2, -3, -4, -Infinity]);
    const validator2 = v(v.and(v.positive, v.positive));
    snapshot(validator2);
    puretables(
      validator2,
      [1, 2, Infinity],
      [0, -0, -1, -2, -3, -4, -Infinity]
    );
  });
  test("rest", () => {
    expect(v.rest).toBe("__quartet/rest__");
  });
  test("restOmit", () => {
    expect(v.restOmit).toBe("__quartet/rest-omit__");
  });
  test("safeInteger", () => {
    expect(typeof v.safeInteger).toBe("function");
    const validator = v(v.safeInteger);
    snapshot(validator);
    puretables(
      validator,
      [1, 2, 1e8, 0, -1, -2, -3],
      [Math.PI, 1e40, NaN, Infinity, -Infinity]
    );
    const validator2 = v({ a: v.safeInteger });
    snapshot(validator2);
    puretables(
      validator2,
      [1, 2, 1e8, 0, -1, -2, -3].map(a => ({ a })),
      [Math.PI, 1e40, NaN, Infinity, -Infinity, [], {}].map(a => ({
        a
      }))
    );
  });
  test("string", () => {
    expect(typeof v.string).toBe("function");
    const validator = v(v.string);
    snapshot(validator);
    puretables(
      validator,
      [...primitives.filter(e => typeof e === "string")],
      [...primitives.filter(e => typeof e !== "string"), [], {}]
    );
    const validator2 = v({ a: v.string });
    snapshot(validator2);
    puretables(
      validator2,
      [...primitives.filter(e => typeof e === "string").map(a => ({ a }))],
      [...primitives.filter(e => typeof e !== "string"), [], {}].map(a => ({
        a
      }))
    );
  });
  test("symbol", () => {
    expect(typeof v.symbol).toBe("function");
    const validator = v(v.symbol);
    snapshot(validator);
    puretables(
      validator,
      [...primitives.filter(e => typeof e === "symbol")],
      [...primitives.filter(e => typeof e !== "symbol"), [], {}]
    );
    const validator2 = v({ a: v.symbol });
    snapshot(validator2);
    puretables(
      validator2,
      [...primitives.filter(e => typeof e === "symbol").map(a => ({ a }))],
      [...primitives.filter(e => typeof e !== "symbol"), [], {}].map(a => ({
        a
      }))
    );
  });
  test("test", () => {
    expect(typeof v.test).toBe("function");
    const validator = v(v.test(/[Aa]nd/));
    snapshot(validator);
    puretables(
      validator,
      ["Andrew", "and", "demand"],
      ["", "ndrew", "nd", "deman"]
    );
    const validator2 = v({ a: v.test(/[Aa]nd/) });
    snapshot(validator2);
    puretables(
      validator2,
      [...["Andrew", "and", "demand"].map(a => ({ a }))],
      [...["", "ndrew", "nd", "deman"], [], {}].map(a => ({
        a
      }))
    );
  });
});
