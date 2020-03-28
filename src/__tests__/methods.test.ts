import { v } from "../index";
import { snapshot, puretables } from "./utils";
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
    puretables(validator, [[], [1], [1, 2, 3.14]], [["1"], ...primitives]);
  });
  test("boolean", () => {
    expect(typeof v.boolean).toBe("function");
    const validator = v(v.boolean);
    snapshot(validator);
    puretables(
      validator,
      [...primitives.filter(e => typeof e === "boolean")],
      [...primitives.filter(e => typeof e !== "boolean"), [], {}]
    );
  });
  test("compileAnd", () => {
    expect(typeof v.compileAnd).toBe("function");
  });
  test("compileArrayOf", () => {
    expect(typeof v.compileArrayOf).toBe("function");
  });
  test("custom", () => {
    expect(typeof v.custom).toBe("function");
  });
  test("function", () => {
    expect(typeof v.function).toBe("function");
    const validator = v(v.function);
    snapshot(validator);
    puretables(validator, [() => {}, function() {}], [...primitives, [], {}]);
  });
  test("max exclusive", () => {
    expect(typeof v.max).toBe("function");
    const validator = v(v.max(5, true));
    puretables(
      validator,
      [1, 2, 3, 4, -Infinity],
      [5, 6, 7, 8, 9, 5.1, Infinity]
    );
    snapshot(validator);
  });
  test("max inclusive", () => {
    const validator = v(v.max(5));
    puretables(
      validator,
      [1, 2, 3, 4, -Infinity, 5],
      [6, 7, 8, 9, 5.1, Infinity]
    );
    snapshot(validator);
  });
  test("maxLength exclusive", () => {
    expect(typeof v.maxLength).toBe("function");
    const validator = v(v.maxLength(5, true));
    puretables(
      validator,
      ["1234", ...[1, 2, 3, 4].map(length => Array.from({ length }, () => 1))],
      [
        "12345",
        ...[6, 7, 8, 9, 5].map(length => Array.from({ length }, () => 1)),
        "123456"
      ]
    );
    snapshot(validator);
  });
  test("maxLength inclusive", () => {
    const validator = v(v.maxLength(5));
    puretables(
      validator,
      [
        "1234",
        "12345",
        ...[1, 2, 3, 4, 5].map(length => Array.from({ length }, () => 1))
      ],
      [...[6, 7, 8, 9].map(length => Array.from({ length }, () => 1)), "123456"]
    );
    snapshot(validator);
  });
  test("min exclusive", () => {
    expect(typeof v.min).toBe("function");
    const validator = v(v.min(5, true));
    puretables(
      validator,
      [6, 7, 8, 9, 5.1, Infinity],
      [1, 2, 3, 4, 5, -Infinity]
    );
    snapshot(validator);
  });
  test("min inclusive", () => {
    expect(typeof v.min).toBe("function");
    const validator = v(v.min(5));
    puretables(
      validator,
      [5, 6, 7, 8, 9, 5.1, Infinity],
      [1, 2, 3, 4, -Infinity]
    );
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
  });
  test("minLength inclusive", () => {
    expect(typeof v.minLength).toBe("function");
    const validator = v(v.minLength(5));
    puretables(
      validator,
      [
        ...[6, 7, 8, 9].map(length => Array.from({ length }, () => 1)),
        "123456",
        "12345"
      ],
      ["1234", ...[1, 2, 3, 4].map(length => Array.from({ length }, () => 1))]
    );
    snapshot(validator);
  });
  test("negative", () => {
    expect(typeof v.negative).toBe("function");
    const validator = v(v.negative);
    snapshot(validator);
    puretables(validator, [-1, -2, -Infinity], [0, -0, 1, 2, 3, 4, Infinity]);
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
  });
  test("not", () => {
    expect(typeof v.not).toBe("function");
  });
  test("positive", () => {
    expect(typeof v.positive).toBe("function");
    const validator = v(v.positive);
    snapshot(validator);
    puretables(validator, [1, 2, Infinity], [0, -0, -1, -2, -3, -4, -Infinity]);
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
  });
});
