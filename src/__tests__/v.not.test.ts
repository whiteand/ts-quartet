import { v } from "../v";
import { testValidator } from "./testValidator";
import { describe, expect } from "vitest";

describe("v.not", (test) => {
  test("v.not", () => {
    testValidator(
      v(v.not(false)),
      [null, [], {}, 1, 0, NaN, undefined, true],
      [false]
    );
    testValidator(
      v({ a: v.not(undefined) }),
      [null, [], {}, 1, 0, NaN, true].map((a) => ({ a })),
      [undefined].map((a) => ({ a }))
    );
    testValidator(
      v({ a: v.not(null) }),
      [[], {}, 1, 0, NaN, undefined, true].map((a) => ({ a })),
      [null].map((a) => ({ a }))
    );
    testValidator(
      v({ a: v.not(1) }),
      [null, [], {}, 0, NaN, true].map((a) => ({ a })),
      [1].map((a) => ({ a }))
    );
    testValidator(
      v({ a: v.not(null) }),
      [[], {}, 1, 0, NaN, undefined, true].map((a) => ({ a })),
      [null].map((a) => ({ a }))
    );
    testValidator(
      v({ a: v.not(v.number) }),
      [[], {}, undefined, true].map((a) => ({ a })),
      [1, 0, NaN].map((a) => ({ a }))
    );
  });
});
