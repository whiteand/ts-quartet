import { v } from "../index";
import { snapshot } from "./utils";
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
});
