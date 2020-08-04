import { e } from "../e";
import { testValidatorWithExplanations } from "./testValidatorWithExplanations";

describe("e.any", () => {
  test("e.any", () => {
    testValidatorWithExplanations(
      e(e.any),
      [null, false, [], {}, 1, 0, NaN, undefined, true],
      []
    );
  });
});
