import { v } from "../index";
import { tables, snapshot, getExplanation } from "./utils";

describe("custom", () => {
  test("works", () => {
    const isEven = (n: number) => n % 2 === 0;
    const checkIsEven = v<number>(v.custom(isEven));
    tables(checkIsEven, [0, 2, 4, 6, 8, 10], [1, 3, 5, 7, 9]);
    snapshot(checkIsEven);
  });
  test("works with simple explanation", () => {
    const isEven = (n: number) => n % 2 === 0;
    const checkIsEven = v<number>(v.custom(isEven, "Is not Even"));
    tables(checkIsEven, [0, 2, 4, 6, 8, 10], [1, 3, 5, 7, 9]);
    snapshot(checkIsEven);
    expect(getExplanation(checkIsEven, 2)).toEqual([]);
    expect(getExplanation(checkIsEven, 1)).toEqual(["Is not Even"]);
  });
  test("works with function explanation", () => {
    const isEven = (n: number) => n % 2 === 0;
    const checkIsEven = v<number>(
      v.custom(isEven, (value: any) =>
        value > 10 ? `${value} is not Even` : undefined
      )
    );
    snapshot(checkIsEven);
    tables(checkIsEven, [0, 2, 4, 6, 8, 10], [1, 3, 5, 7, 9]);
    expect(getExplanation(checkIsEven, 2)).toEqual([]);
    expect(getExplanation(checkIsEven, 1)).toEqual([]);
    expect(getExplanation(checkIsEven, 11)).toEqual(["11 is not Even"]);
  });
});
