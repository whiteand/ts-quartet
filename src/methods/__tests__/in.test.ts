import { getInMethod } from "../in";

const inMethod = getInMethod({ allErrors: false });

describe("in", () => {
  test("Works for empty dictinary", () => {
    const checkNothing = inMethod({});
    expect(checkNothing(undefined)).toBe(false);
    expect(checkNothing("Andrew")).toBe(false);
    expect(checkNothing(1)).toBe(false);
    expect(checkNothing("toString")).toBe(false);
  });
  test("Works for not empty dictinary", () => {
    const checkNothing = inMethod({
      a: true,
      b: false,
      c: undefined
    });
    expect(checkNothing("a")).toBe(true);
    expect(checkNothing("b")).toBe(true);
    expect(checkNothing("c")).toBe(false);
  });
});
