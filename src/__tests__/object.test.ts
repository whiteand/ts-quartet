import { v } from "../index";
import { snapshot, puretables } from "./utils";

describe("v(object)", () => {
  test("00. v({})", () => {
    const validator = v({});
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [1, true, {}, [], "", false], [null, undefined]);
  });
  test("01. v({ a: null })", () => {
    // TODO: Add it!
  });
  test("02. v({ a: undefined })", () => {
    // TODO: Add it!
  });
  test("03. v({ a: NaN })", () => {
    // TODO: Add it!
  });
  test("04. v({ a: 42 })", () => {
    // TODO: Add it!
  });
  test('05. v({ a: "true" })', () => {
    // TODO: Add it!
  });
  test('06. v({ a: "false" })', () => {
    // TODO: Add it!
  });
  test('07. v({ a: "test" })', () => {
    // TODO: Add it!
  });
  test('08. v({ a: Symbol.for("test") })', () => {
    // TODO: Add it!
  });
  test("09. v({ a: true })", () => {
    // TODO: Add it!
  });
  test("10. v({ a: false })", () => {
    // TODO: Add it!
  });
  test("11. v({ a: funcWithPrepare })", () => {
    // TODO: Add it!
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
