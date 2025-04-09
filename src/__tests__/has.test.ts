import { has } from "../utils";
import { describe, expect } from "vitest";

describe("has", (test) => {
  test('has(null, "toString")', () => {
    expect(has(null, "toString")).toBe(false);
  });
  test('has(undefined, "toString")', () => {
    expect(has(undefined, "toString")).toBe(false);
  });
  test('has(1, "toString"', () => {
    expect(has(1, "toString")).toBe(false);
  });
  test('has({ a }, "a"', () => {
    expect(has({ a: undefined }, "a")).toBe(true);
  });
});
