import { describe } from "vitest";
import { e as v } from "../e";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.pair", (test) => {
  test("v.pair", () => {
    testValidatorImpure(
      v(v.pair({ key: undefined, value: 10 })),
      [10],
      [null, false, undefined, "10", { valueOf: () => 10 }]
    );
  });
  test("{ a: v.pair }", () => {
    testValidatorImpure(
      v({ a: v.pair({ key: "a", value: 10 }) }),
      [{ a: 10 }],
      [null, false, undefined, "10", { valueOf: () => 10 }].map((a) => ({ a }))
    );
  });
});
