import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v.array", () => {
  test("v.array", () => {
    testValidator(
      v(v.array),
      [[], [1, 2, "3"]],
      [{}, { length: 10 }, "Andrew"]
    );
  });
});
