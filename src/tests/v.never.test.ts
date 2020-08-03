import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v.never", () => {
  test("v.never", () => {
    testValidator(
      v(v.never),
      [],
      [null, false, [], {}, 1, 0, NaN, undefined, true]
    );
  });
});
