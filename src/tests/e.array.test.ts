import { e as v } from "..";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.array", () => {
  test("v.array", () => {
    testValidatorImpure(
      v(v.array),
      [[], [1, 2, "3"]],
      [{}, { length: 10 }, "Andrew"]
    );
  });
});
