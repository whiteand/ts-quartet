import { v } from "../index";
import { tables, snapshot } from "./utils";

describe("not", () => {
  test("constant", () => {
    const checkNot42 = v(v.not(42));
    tables(checkNot42, [41, "42", 43, null, false], [42]);
    snapshot(checkNot42);
  });
  test("custom", () => {
    const checkNot42 = v(v.not(v.custom(v => v === 42)));
    tables(checkNot42, [41, "42", 43, null, false], [42]);
    snapshot(checkNot42);
  });
  test("function", () => {
    const checkNotANumber = v(v.not(v.number));
    tables(
      checkNotANumber,
      ["1", "2", false, null, true, undefined],
      [NaN, Infinity, -Infinity, 0, 1, 2, 3]
    );
    snapshot(checkNotANumber);
  });
});
