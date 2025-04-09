import { v } from "../v";
import { testValidator } from "./testValidator";
import { describe } from "vitest";

describe("v.test", (test) => {
  test("v.test", () => {
    testValidator(
      v(v.test(/^a/)),
      ["a", "andrew"],
      ["A", null, false, [], {}, 1, 0, NaN, undefined, true],
    );
  });
  test("{ a: v.test }", () => {
    testValidator(
      v({ a: v.test(/^a/) }),
      ["a", "andrew"].map((a) => ({ a })),
      [
        "A",
        null,
        false,
        [],
        {},
        1,
        0,
        NaN,
        undefined,
        true,
        ...["A", null, false, [], {}, 1, 0, NaN, undefined, true].map((a) => ({
          a,
        })),
      ],
    );
  });
});
