import { v } from "../v";
import { testValidator } from "./testValidator";
import { describe } from "vitest";

describe("v.pair", (test) => {
  test("v.pair", () => {
    testValidator(
      v(v.pair({ key: undefined, value: 10 })),
      [10],
      [null, false, undefined, "10", { valueOf: () => 10 }]
    );
  });
});
