import { v } from "../v";
import { testValidator } from "./testValidator";
import { describe } from "vitest";

describe("v.array", (test) => {
  test("v.array", () => {
    testValidator(
      v(v.array),
      [[], [1, 2, "3"]],
      [{}, { length: 10 }, "Andrew"],
    );
  });
  test("{ a: v.array }", () => {
    testValidator(
      v({ a: v.array }),
      [[], [1, 2, "3"]].map((a) => ({ a })),
      [{}, { length: 10 }, "Andrew"].map((a) => ({ a })),
    );
  });
});
