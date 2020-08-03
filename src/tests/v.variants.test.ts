import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v([...])", () => {
  test("v([])", () => {
    testValidator(v([]), [], [null, false, [], {}, 1, 0, NaN, undefined, true]);
  });
  test("v([1])", () => {
    testValidator(v([1]), [1], [null, false, [], {}, 0, NaN, undefined, true]);
  });
  test("v([true, false])", () => {
    let flag = true;
    const validator = v([
      v.any,
      v.custom(() => {
        flag = false;
        return false;
      })
    ]);
    validator(1);
    expect(flag).toBeTruthy();
  });
});
