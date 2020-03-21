import { v } from "../index";
import { snapshot, tables } from "./utils";
import { getExplanatoryFunc } from "./getExplanatoryFunc";

describe("arrayOf", () => {
  test("constant schema", () => {
    snapshot(v.compileArrayOf(1));
    snapshot(v.compileArrayOf("1"));
    snapshot(v.compileArrayOf("true"));
    snapshot(v.compileArrayOf(Symbol.for("name")));
  });
  test("function", () => {
    snapshot(v.compileArrayOf(getExplanatoryFunc("A", "Is not A")));
  });
  test("works", () => {
    const checkNumberArr = v.compileArrayOf(v.number);
    tables(
      checkNumberArr,
      [[], [1], [-1, 0, 1], [1, 1.5, Infinity, NaN]],
      [null, { length: 1, 0: 1 }, [1, 2, "3"], ["1"]]
    );
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
    snapshot(validator);
  });
});
