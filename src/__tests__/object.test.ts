import { v } from "../index";
import { snapshot, puretables, tables } from "./utils";
import {
  primitives,
  funcSchemaWithPrepare,
  funcSchemaWithNot,
  funcSchema,
  funcSchemaWithNotHandleError
} from "./mocks";

describe("v(object)", () => {
  test("00. v({})", () => {
    const validator = v({});
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [1, true, {}, [], "", false], [null, undefined]);
  });
  test("01. v({ a: null })", () => {
    const validator = v({ a: null });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: null }, { a: null, b: 42 }, Object.assign([], { a: null })],
      [...primitives, {}, { a: undefined }, { a: "null" }]
    );
  });
  test("02. v({ a: undefined })", () => {
    const validator = v({ a: undefined });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [
        { a: undefined },
        { a: undefined, b: 42 },
        Object.assign([], { a: undefined })
      ],
      [null, undefined, { a: null }, { a: "null" }]
    );
  });
  test("03. v({ a: NaN })", () => {
    const validator = v({ a: NaN });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: NaN }, { a: NaN, b: 42 }, Object.assign([], { a: NaN })],
      [...primitives, {}, { a: null }, { a: "null" }]
    );
  });
  test("04. v({ a: 42 })", () => {
    const validator = v({ a: 42 });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: 42 }, { a: 42, b: 42 }, Object.assign([], { a: 42 })],
      [...primitives, {}, { a: null }, { a: "null" }]
    );
  });
  test('05. v({ a: "true" })', () => {
    const validator = v({ a: "true" });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: "true" }, { a: "true", b: "" }, Object.assign([], { a: "true" })],
      [...primitives, {}, { a: null }, { a: true }, { a: "null" }]
    );
  });
  test('06. v({ a: "false" })', () => {
    const validator = v({ a: "false" });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [
        { a: "false" },
        { a: "false", b: "" },
        Object.assign([], { a: "false" })
      ],
      [...primitives, {}, { a: null }, { a: false }, { a: "null" }]
    );
  });
  test('07. v({ a: "test" })', () => {
    const validator = v({ a: "test" });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: "test" }, { a: "test", b: "" }, Object.assign([], { a: "test" })],
      [...primitives, {}, { a: null }, { a: false }, { a: "null" }]
    );
  });
  test('08. v({ a: Symbol.for("test") })', () => {
    const validator = v({ a: Symbol.for("test") });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [
        { a: Symbol.for("test") },
        { a: Symbol.for("test"), b: "" },
        Object.assign([], { a: Symbol.for("test") })
      ],
      [...primitives, {}, { a: null }, { a: false }, { a: "null" }]
    );
  });
  test("09. v({ a: true })", () => {
    const validator = v({ a: true });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: true }, { a: true, b: "" }, Object.assign([], { a: true })],
      [...primitives, {}, { a: null }, { a: false }, { a: "null" }]
    );
  });
  test("10. v({ a: false })", () => {
    const validator = v({ a: false });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: false }, { a: false, b: "" }, Object.assign([], { a: false })],
      [...primitives, {}, { a: null }, { a: true }, { a: "null" }]
    );
  });
  test("11. v({ a: funcWithPrepare })", () => {
    const validator = v({ a: funcSchemaWithPrepare });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: 2 }, { a: 4, b: 1 }],
      [...primitives, { a: 1 }, {}]
    );
  });
  test("12. v({ a: funcWithoutPrepare })", () => {
    const validator = v({ a: funcSchema });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: 2 }, { a: 4, b: 1 }],
      [...primitives, { a: 1 }, {}]
    );
  });
  test("13. v({ a: funcWithHandle })", () => {
    const validator = v({ a: funcSchemaWithNotHandleError });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: 2 }, { a: 4, b: 1 }],
      [
        [null, []],
        [undefined, []],
        [1, [undefined]],
        [{ a: 1 }, [1]],
        [{}, [undefined]]
      ]
    );
  });
  test("15. v({ a: { b: pureFunc } })", () => {
    const validator = v({ a: { b: funcSchema } });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: { b: 2 } }, { a: { b: 4, d: 3 }, c: 1 }],
      [...primitives, {}, { a: 1 }, { a: { b: undefined } }, { a: { b: 1 } }]
    );
  });
  test("16. v({ a: { b: impureFunc } })", () => {
    const validator = v({ a: { b: funcSchemaWithNotHandleError } });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: { b: 2 } }, { a: { b: 4, d: 3 }, c: 1 }],
      [
        ...primitives.map(p => [p, []] as [any, any[]]),
        [{}, []],
        [{ a: 1 }, [undefined]],
        [{ a: { b: undefined } }, [undefined]],
        [{ a: { b: 1 } }, [1]]
      ]
    );
  });
  test("17. v({ a: { b: pureFunc }, c: pureFunc })", () => {
    const validator = v({ a: { b: funcSchema }, c: funcSchema });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: { b: 2 }, c: 2 }, { a: { b: 4, d: 3 }, c: 4 }],
      [
        ...primitives,
        {},
        { a: null },
        { a: { b: 4 } },
        { a: { b: 4 }, c: 1 },
        { a: { b: 1 }, c: 4 }
      ]
    );
  });
  test("18. v({ a: { b: impureFunc }, c: pureFunc })", () => {
    const validator = v({
      a: { b: funcSchemaWithNotHandleError },
      c: funcSchema
    });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: { b: 2 }, c: 2 }, { a: { b: 4, d: 3 }, c: 4 }],
      [
        ...primitives.map(p => [p, []] as [any, any[]]),
        [{}, []],
        [{ a: null }, []],
        [{ a: { b: 4 } }, []],
        [{ a: { b: 4 }, c: 1 }, []],
        [{ a: { b: 1 }, c: 4 }, [1]]
      ]
    );
  });
  test("19. v({ a: { b: pureFunc }, c: impureFunc })", () => {
    const validator = v({
      a: { b: funcSchema },
      c: funcSchemaWithNotHandleError
    });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: { b: 2 }, c: 2 }, { a: { b: 4, d: 3 }, c: 4 }],
      [
        ...primitives.map(p => [p, []] as [any, any[]]),
        [{}, []],
        [{ a: null }, []],
        [{ a: { b: 4 } }, [undefined]],
        [{ a: { b: 4 }, c: 1 }, [1]],
        [{ a: { b: 1 }, c: 4 }, []]
      ]
    );
  });
  test("20. v({ a: { b: impureFunc }, c: impureFunc })", () => {
    const validator = v({
      a: { b: funcSchemaWithNotHandleError },
      c: funcSchemaWithNotHandleError
    });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: { b: 2 }, c: 2 }, { a: { b: 4, d: 3 }, c: 4 }],
      [
        ...primitives.map(p => [p, []] as [any, any[]]),
        [{}, []],
        [{ a: null }, []],
        [{ a: { b: 4 } }, [undefined]],
        [{ a: { b: 4 }, c: 1 }, [1]],
        [{ a: { b: 1 }, c: 4 }, [1]]
      ]
    );
  });
  test("21. v({ a: { b: 42 }})", () => {
    const validator = v({ a: { b: 42 } });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [
        { a: { b: 42 } },
        { a: { b: 42 }, c: 1 },
        { a: { b: 42, c: 2 } },
        { a: { b: 42, d: 4 }, c: 3 }
      ],
      [{ a: { b: 41 } }, { a: {} }, { a: null }, {}, ...primitives]
    );
  });
  test("22. v({ a: { b: 42, c: pureFunc }})", () => {
    const validator = v({ a: { b: 42, c: funcSchemaWithNot } });
    snapshot(validator);
    expect(validator.pure).toBe(true);
    puretables(
      validator,
      [
        { a: { b: 42, c: 2 } },
        { a: { b: 42, c: 4 }, c: 1 },
        { a: { b: 42, c: 2 } },
        { a: { b: 42, d: 4, c: 8 }, c: 3 }
      ],
      [{ a: { b: 41 } }, { a: {} }, { a: null }, {}, ...primitives]
    );
  });
  test("23. v({ a: { b: 42, c: impureFunc }})", () => {
    const validator = v({ a: { b: 42, c: funcSchemaWithNotHandleError } });
    snapshot(validator);
    expect(validator.pure).toBe(false);
    tables(
      validator,
      [
        { a: { b: 42, c: 2 } },
        { a: { b: 42, c: 4 }, c: 1 },
        { a: { b: 42, c: 2 } },
        { a: { b: 42, d: 4, c: 8 }, c: 3 }
      ],
      [
        [{ a: { b: 41, c: 1 } }, []],
        [{ a: { b: 42, c: 1 } }, [1]],
        [{ a: { b: 41 } }, []],
        [{ a: { b: 42 } }, [undefined]],
        [{ a: {} }, []],
        [{ a: null }, []],
        [{}, []],
        ...primitives.map(p => [p, []] as [any, any[]])
      ]
    );
  });
  test("24. v({ a: { b: 42, [v.rest]: pureFunc }})", () => {
    const validator = v({ a: { b: 42, [v.rest]: funcSchemaWithNot } });
    snapshot(validator);
    expect(validator.pure).toBe(true);
    puretables(
      validator,
      [
        { a: { b: 42, c: 2 } },
        { a: { b: 42, c: 4 }, c: 1 },
        { a: { b: 42, c: 2 } },
        { a: { b: 42, d: 4, c: 8 }, c: 3 }
      ],
      [
        { a: { b: 41, c: 1 } },
        { a: { b: 42, c: 1 } },
        { a: { b: 41 } },
        { a: {} },
        { a: null },
        {},
        ...primitives
      ]
    );
  });
  test("25. v({ a: { b: 42, [v.rest]: impureFunc }})", () => {
    const validator = v({
      a: { b: 42, [v.rest]: funcSchemaWithNotHandleError }
    });
    snapshot(validator);
    expect(validator.pure).toBe(false);
    tables(
      validator,
      [
        { a: { b: 42, c: 2 } },
        { a: { b: 42, c: 4 }, c: 1 },
        { a: { b: 42, c: 2 } },
        { a: { b: 42, d: 4, c: 8 }, c: 3 }
      ],
      [
        [{ a: { b: 41, c: 1 } }, []],
        [{ a: { b: 42, c: 1 } }, [1]],
        [{ a: { b: 42, c: 2, d: 3 } }, [3]],
        [{ a: { b: 41 } }, []],
        [{ a: {} }, []],
        [{ a: null }, []],
        [{}, []],
        ...primitives.map(p => [p, []] as [any, any[]])
      ]
    );
  });
  test("26. v({ a: [] })", () => {
    const validator = v({ a: [] });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [], [{ a: 1 }, {}, ...primitives]);
  });
  test("27. v({ a: [42] })", () => {
    const validator = v({ a: [42] });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: 42 }, { a: 42, b: 42 }, Object.assign([], { a: 42 })],
      [...primitives, {}, { a: null }, { a: "null" }]
    );
  });
  test("28. v({ a: [pureFunc, pureFunc] })", () => {
    const validator = v({ a: [v.string, funcSchemaWithNot] });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: 42 }, { a: "9" }, { a: 42, b: 42 }, Object.assign([], { a: 42 })],
      [...primitives, {}, { a: null }, { a: 41 }]
    );
  });
  test("29. v({ a: [impureFunc, pureFunc] })", () => {
    const validator = v({ a: [funcSchemaWithNotHandleError, v.string] });
    expect(validator.pure).toBe(false);
    snapshot(validator);
    tables(
      validator,
      [{ a: 42 }, { a: "9" }, { a: 42, b: 42 }, Object.assign([], { a: 42 })],
      [
        ...primitives.map(
          e => [e, e == null ? [] : [undefined]] as [any, any[]]
        ),
        [{}, [undefined]],
        [{ a: null }, [null]],
        [{ a: 41 }, [41]]
      ]
    );
  });
  test("30. v({ a: 41, b: 42 })", () => {
    const validator = v({ a: 41, b: 42 });
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(
      validator,
      [{ a: 41, b: 42 }, { a: 41, b: 42, c: 10 }],
      [...primitives, {}, { a: 41, b: 43 }, { a: 40, b: 42 }]
    );
  });
  test("31. v({ explanations: 42 })", () => {
    const validator = v({ explanations: 42 });
    expect(validator.pure).toBe(true);
  });
});
