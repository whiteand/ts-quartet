import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v.test", () => {
  test("v.test", () => {
    testValidator(
      v(v.test(/^a/)),
      ["a", "andrew"],
      ["A", null, false, [], {}, 1, 0, NaN, undefined, true]
    );
  });
});
