import { e } from "../e";
import { testValidatorImpure } from "./testValidatorImpure";

describe("e.any", () => {
  test("e.any", () => {
    testValidatorImpure(
      e(e.any),
      [null, false, [], {}, 1, 0, NaN, undefined, true],
      []
    );
  });
});
