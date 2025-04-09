import { v } from "../v";
import { testValidator } from "./testValidator";
import { describe } from "vitest";

describe("coverage of ifInvalidReturnFalse", (test) => {
  test("schema: null", () => {
    const validator = v({ a: null });
    testValidator(
      validator,
      [{ a: null }, { a: null, b: false }],
      [null, false, undefined, {}, { a: undefined }, { a: "null" }],
    );
  });
});
