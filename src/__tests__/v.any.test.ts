import { v } from "../v";
import { testValidator } from "./testValidator";
import { describe } from "vitest";

describe("v.any", (test) => {
  test("v.any", () => {
    testValidator(
      v(v.any),
      [null, false, [], {}, 1, 0, NaN, undefined, true],
      [],
    );
  });
  test("{ a: v.any }", () => {
    testValidator(
      v({ a: v.any }),
      [null, false, [], {}, 1, 0, NaN, undefined, true].map((a) => ({ a })),
      [null, undefined],
    );
  });
});
