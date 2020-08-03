import { e as v } from "..";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.test", () => {
  test("v.test", () => {
    testValidatorImpure(
      v(v.test(/^a/)),
      ["a", "andrew"],
      ["A", null, false, [], {}, 1, 0, NaN, undefined, true]
    );
  });
});
