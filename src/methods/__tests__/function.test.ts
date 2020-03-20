import { getFunctionValidator } from "../function";

const isFunction = getFunctionValidator({ allErrors: false });

describe("getFunctionValidator", () => {
  test("Positive", () => {
    expect(isFunction(() => {})).toBe(true);
    expect(isFunction(function() {})).toBe(true);
    const a = {
      method() {}
    };
    expect(isFunction(a.method)).toBe(true);
  });
  test("Negative", () => {
    expect(isFunction("funtion")).toBe(false);
    expect(isFunction(NaN)).toBe(false);
    expect(isFunction(null)).toBe(false);
  });
});
