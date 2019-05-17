import quartet from "../index";
import { IKeyParentSchema, InstanceSettings, Validator } from "../types";

test("quartet is function", () => {
  expect(typeof quartet).toBe("function");
});

test("constant validations", () => {
  const v = quartet();
  expect(typeof v).toBe("function");
  expect(v("string")("str")).toBe(false);
  expect(v("string")("string")).toBe(true);
  expect(v(1)(2)).toBe(false);
  expect(v(1)(1)).toBe(true);
  expect(v(null)({})).toBe(false);
  expect(v(null)(null)).toBe(true);
  expect(v(undefined)(2)).toBe(false);
  expect(v(undefined)(undefined)).toBe(true);
  expect(v(true)(false)).toBe(false);
  expect(v(true)(true)).toBe(true);
  expect(v(false)(true)).toBe(false);
  expect(v(false)(false)).toBe(true);
  const symbol = Symbol.for("test");
  expect(v(symbol)(2)).toBe(false);
  expect(v(symbol)(symbol)).toBe(true);
});
