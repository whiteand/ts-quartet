import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v.any", () => {
  test("v.any", () => {
    testValidator(
      v(v.any),
      [null, false, [], {}, 1, 0, NaN, undefined, true],
      []
    );
  });
});
