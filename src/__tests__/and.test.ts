import { v } from "../index";
import { snapshot, tables } from "./utils";

describe("v.and", () => {
  test("v.and()", () => {
    const validator = v.and();
    snapshot(validator);
  });
  test("v.and(1)", () => {
    const validator = v.and(1);
    snapshot(validator);
    tables(validator, [1], [2]);
  });
  test("v.and(1, 1)", () => {
    const validator = v.and(1, 1);
    snapshot(validator);
    tables(validator, [1], [2]);
  });
  test("v.and(1, 1, 2)", () => {
    const validator = v.and(1, 1, 2);
    tables(validator, [], [1, 2]);
    snapshot(validator);
  });
  test("v.and(v.positive, v.number)", () => {
    const validator = v.and(v.positive, v.number);
    tables(validator, [1, 0.1, Infinity, 10], [0, -1, -Infinity, "text"]);
    snapshot(validator);
  });
  test("v({ a: v.number }, { b: v.string})", () => {
    const validator = v.and({ a: v.number }, { b: v.string });
    tables(validator, [{ a: 1, b: "2" }], [{ a: "1", b: "2" }, { a: 1, b: 2 }]);
    snapshot(validator);
  });
});
