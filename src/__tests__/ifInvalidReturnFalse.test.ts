import { v } from "../v";
import { testValidator } from "./testValidator";

describe("coverage of ifInvalidReturnFalse", () => {
  test("schema: null", () => {
    const validator = v({ a: null });
    testValidator(
      validator,
      [{ a: null }, { a: null, b: false }],
      [null, false, undefined, {}, { a: undefined }, { a: "null" }]
    );
  });
});
