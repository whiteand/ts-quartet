import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v.not", () => {
  test("v.not", () => {
    testValidator(
      v(v.not(false)),
      [null, [], {}, 1, 0, NaN, undefined, true],
      [false]
    );
  });
});
