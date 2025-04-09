import { v } from "../v";
import { testValidator } from "./testValidator";
import { describe } from "vitest";

describe("v.never", (test) => {
  test("v.never", () => {
    testValidator(
      v(v.never),
      [],
      [null, false, [], {}, 1, 0, NaN, undefined, true]
    );
  });
});
