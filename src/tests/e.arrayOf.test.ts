import { e as v } from "..";
import { testValidatorImpure } from "./testValidatorImpure";

describe("v.arrayOf", () => {
  test("v.arrayOf(v.number)", () => {
    testValidatorImpure(
      v(v.arrayOf(v.number)),
      [[], [1, NaN, 2]],
      [[1, 2, "3"], ["3"], [[1]], {}, { length: 10 }, "Andrew"]
    );
  });
  test("v.arrayOf(v.pair)", () => {
    const checkSquares = v(
      v.arrayOf(
        v.pair(
          v.custom(({ key, value }: { key: number; value: any }) => {
            return value === key * key;
          })
        )
      )
    );
    testValidatorImpure(
      checkSquares,
      [[], [0, 1], [0, 1, 4]],
      [[1], [0, 2], [1, 2, "3"], ["3"], [[1]], {}, { length: 10 }, "Andrew"]
    );
  });
});
