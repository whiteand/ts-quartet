import { e as v } from "..";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v([...])", () => {
  test("v([])", () => {
    testValidatorImpure(
      v([]),
      [],
      [null, false, [], {}, 1, 0, NaN, undefined, true]
    );
  });
  test("v([1])", () => {
    testValidatorImpure(
      v([1]),
      [1],
      [null, false, [], {}, 0, NaN, undefined, true]
    );
  });
  test("v([1, 2])", () => {
    testValidatorImpure(
      v([1, 2]),
      [1, 2],
      ["2", "1", null, false, [], {}, 0, NaN, undefined, true]
    );
  });
  test("v([1, '2'])", () => {
    testValidatorImpure(
      v([1, "2"]),
      [1, "2"],
      [2, "1", null, false, [], {}, 0, NaN, undefined, true]
    );
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
