import { v } from "../index";
import { snapshot, tables } from "./utils";
import { getExplanatoryFunc } from "./getExplanatoryFunc";

describe("arrayOf", () => {
  test("constant schema", () => {
    snapshot(v.arrayOf(1));
    snapshot(v.arrayOf("1"));
    snapshot(v.arrayOf("true"));
    snapshot(v.arrayOf(Symbol.for("name")));
  });
  test("function", () => {
    snapshot(v.arrayOf(getExplanatoryFunc("A", "Is not A")));
  });
  test("works", () => {
    const checkNumberArr = v.arrayOf(v.number);
    tables(
      checkNumberArr,
      [[], [1], [-1, 0, 1], [1, 1.5, Infinity, NaN]],
      [null, { length: 1, 0: 1 }, [1, 2, "3"], ["1"]]
    );
    snapshot(checkNumberArr);
  });
});
