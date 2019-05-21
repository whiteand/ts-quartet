import { getMinMethod, getMaxMethod } from "./../minmax";

const min = getMinMethod({});
const max = getMaxMethod({});

test("minmax: number", () => {
  expect(min(1)(2)).toBe(true);
  expect(min(1)(1)).toBe(true);
  expect(min(1, true)(1)).toBe(false);
  expect(max(1)(0)).toBe(true);
  expect(max(1)(1)).toBe(true);
  expect(max(1, true)(1)).toBe(false);
});

test("minmax: string", () => {
  expect(min(1)("ab")).toBe(true);
  expect(min(1)("a")).toBe(true);
  expect(min(1, true)("a")).toBe(false);
  expect(max(1)("")).toBe(true);
  expect(max(1)("a")).toBe(true);
  expect(max(1, true)("a")).toBe(false);
});

test("minmax: arrays", () => {
  expect(min(1)([1, 2])).toBe(true);
  expect(min(1)([1])).toBe(true);
  expect(min(1, true)([1])).toBe(false);
  expect(max(1)([])).toBe(true);
  expect(max(1)([1])).toBe(true);
  expect(max(1, true)([1])).toBe(false);
});
