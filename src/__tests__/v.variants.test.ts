import { v } from "../v";
import { testValidator } from "./testValidator";

describe("v([...])", () => {
  test("v([])", () => {
    testValidator(v([]), [], [null, false, [], {}, 1, 0, NaN, undefined, true]);
  });
  test("v([1])", () => {
    testValidator(v([1]), [1], [null, false, [], {}, 0, NaN, undefined, true]);
  });
  test("v([1, 2])", () => {
    testValidator(
      v([1, 2]),
      [1, 2],
      ["2", "1", null, false, [], {}, 0, NaN, undefined, true]
    );
  });
  test("v([1, '2'])", () => {
    testValidator(
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
  test("v({ a: [1, 2] })", () => {
    const validator = v({ a: [1, 2] });
    testValidator(
      validator,
      [{ a: 1 }, { a: 2 }, { a: 1, b: 2 }, { a: 2, b: 3 }],
      [{}, null, undefined, { a: "1" }, { a: "2" }]
    );
  });
});
