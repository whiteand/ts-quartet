import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v.pair", () => {
  test("v.pair", () => {
    testValidator(
      v(v.pair({ key: undefined, value: 10 })),
      [10],
      [null, false, undefined, "10", { valueOf: () => 10 }]
    );
  });
});
