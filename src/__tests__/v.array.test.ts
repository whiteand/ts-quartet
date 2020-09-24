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
  test("{ a: v.array }", () => {
    testValidator(
      v({ a: v.array }),
      [[], [1, 2, "3"]].map(a => ({ a })),
      [{}, { length: 10 }, "Andrew"].map(a => ({ a }))
    );
  });
});
