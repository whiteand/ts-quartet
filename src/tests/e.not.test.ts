import { e as v } from "..";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.not", () => {
  test("v.not", () => {
    testValidatorImpure(
      v(v.not(false)),
      [null, [], {}, 1, 0, NaN, undefined, true],
      [false]
    );
  });
});
