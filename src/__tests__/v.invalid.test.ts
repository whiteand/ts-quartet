import { describe, expect } from "vitest";
import { v } from "../v";
import { Z } from "../types";

describe("invalid", (it) => {
  it("fails when custom function passed", () => {
    expect(() =>
      v({
        a: (x) => x !== 42,
      } as Z)
    ).toThrowErrorMatchingInlineSnapshot(`[Error: Wrap your validation function with v.custom(...) instead of usage of the function directly]`);
  });
});
