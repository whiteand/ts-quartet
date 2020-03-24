import { v } from "../index";
import { snapshot, tables } from "./utils";
import { getExplanatoryFunc } from "./getExplanatoryFunc";

describe("arrayOf", () => {
  test("constant schema", () => {
    const isOne = v.compileArrayOf(1);
    snapshot(isOne);
    expect(isOne.pure).toBe(true);
    const isOneStr = v.compileArrayOf("1");
    snapshot(isOneStr);
    expect(isOneStr.pure).toBe(true);
    const isTrue = v.compileArrayOf(true);
    snapshot(isTrue);
    expect(isTrue.pure).toBe(true);
    const isSymbol = v.compileArrayOf(Symbol.for("name"));
    snapshot(isSymbol);
    expect(isSymbol.pure).toBe(true);
  });
  test("function", () => {
    const validator = v.compileArrayOf(getExplanatoryFunc("A", "Is not A"));
    expect(validator.pure).toBe(false);
    snapshot(validator);
  });
  test("works", () => {
    const checkNumberArr = v.compileArrayOf(v.number);
    tables(
      checkNumberArr,
      [[], [1], [-1, 0, 1], [1, 1.5, Infinity, NaN]],
      [null, { length: 1, 0: 1 }, [1, 2, "3"], ["1"]]
    );
    expect(checkNumberArr.pure).toBe(true);
    snapshot(checkNumberArr);
  });
  test("full: without explanations", () => {
    const validator = v({
      age: v.and(v.positive, v.safeInteger),
      gender: ["male", "female"],
      grades: v.arrayOf([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
      name: v.string,
      friends: v.arrayOf(v.string)
    });
    expect(validator.pure).toBe(true);
    snapshot(validator);
  });
});
