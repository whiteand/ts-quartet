import { getAlloc } from "../getAlloc";

describe("getAlloc", () => {
  test("single prefix", () => {
    const ctx: Record<string, any> = {};
    const alloc = getAlloc(ctx, "ctx");

    expect(alloc("something", 42)).toEqual("ctx.something");
    expect(ctx).toEqual({ something: 42 });
  });
  test("singleton alloc", () => {
    const ctx: Record<string, any> = {};
    const alloc = getAlloc(ctx, "ctx");

    expect(alloc("something", 42, true)).toEqual("ctx.something");
    expect(alloc("something", 42, true)).toEqual("ctx.something");
    expect(ctx).toEqual({ something: 42 });
  });
  test("wrong singleton", () => {
    const ctx: Record<string, any> = {};
    const alloc = getAlloc(ctx, "ctx");

    expect(alloc("something", 42, true)).toEqual("ctx.something");
    expect(() =>
      alloc("something", 43, true)
    ).toThrowErrorMatchingInlineSnapshot(`"Wrong singleton usage"`);
    expect(ctx).toEqual({ something: 42 });
  });
});
