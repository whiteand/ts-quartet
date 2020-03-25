import { v } from "../index";
import { snapshot, puretables } from "./utils";
import { primitives, funcSchemaWithPrepare } from "./mocks";

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
    // TODO: Add it!
  });
  test("13. v({ a: funcWithHandle })", () => {
    // TODO: Add it!
  });
  test("14. v({ a: funcWithoutHandle })", () => {
    // TODO: Add it!
  });
  test("15. v({ a: { b: pureFunc } })", () => {
    // TODO: Add it!
  });
  test("16. v({ a: { b: impureFunc } })", () => {
    // TODO: Add it!
  });
  test("17. v({ a: { b: pureFunc }, c: pureFunc })", () => {
    // TODO: Add it!
  });
  test("18. v({ a: { b: impureFunc }, c: pureFunc })", () => {
    // TODO: Add it!
  });
  test("19. v({ a: { b: pureFunc }, c: impureFunc })", () => {
    // TODO: Add it!
  });
  test("20. v({ a: { b: impureFunc }, c: impureFunc })", () => {
    // TODO: Add it!
  });
  test("21. v({ a: { b: 42 }})", () => {
    // TODO: Add it!
  });
  test("22. v({ a: { b: 42, c: pureFunc }})", () => {
    // TODO: Add it!
  });
  test("23. v({ a: { b: 42, c: impureFunc }})", () => {
    // TODO: Add it!
  });
  test("24. v({ a: { b: 42, [v.rest]: pureFunc }})", () => {
    // TODO: Add it!
  });
  test("25. v({ a: { b: 42, [v.rest]: impureFunc }})", () => {
    // TODO: Add it!
  });
  test("26. v({ a: [] })", () => {
    // TODO: Add it!
  });
  test("27. v({ a: [42] })", () => {
    // TODO: Add it!
  });
  test("28. v({ a: [pureFunc, pureFunc] })", () => {
    // TODO: Add it!
  });
  test("29. v({ a: [impureFunc, pureFunc] })", () => {
    // TODO: Add it!
  });
  test("30. v({ a: 41, b: 42 })", () => {
    // TODO: Add it!
  });
});
