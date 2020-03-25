import { compileConstant } from "../compileConstant";

describe("compile constant", () => {
  test("compiles", () => {
    const check42 = compileConstant(42);
    expect(check42(41)).toBe(false);
    expect(check42("42")).toBe(false);
    expect(check42(Symbol.for("42"))).toBe(false);
    expect(check42(42)).toBe(true);
  });
});
