import { e as v } from "..";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.never", () => {
  test("v.never", () => {
    testValidatorImpure(
      v(v.never),
      [],
      [null, false, [], {}, 1, 0, NaN, undefined, true]
    );
  });
});
