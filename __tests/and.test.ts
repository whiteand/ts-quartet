import { v } from "../index";
import { snapshot, tables } from "./utils";

describe("v.compileAnd", () => {
  test("v.compileAnd()", () => {
    const validator = v.compileAnd();
    snapshot(validator);
  });
  test("v.compileAnd(1)", () => {
    const validator = v.compileAnd(1);
    snapshot(validator);
    tables(validator, [1], [2]);
  });
  test("v.compileAnd(1, 1)", () => {
    const validator = v.compileAnd(1, 1);
    snapshot(validator);
    tables(validator, [1], [2]);
  });
  test("v.compileAnd(1, 1, 2)", () => {
    const validator = v.compileAnd(1, 1, 2);
    tables(validator, [], [1, 2]);
    snapshot(validator);
  });
  test("v.compileAnd(v.positive, v.number)", () => {
    const validator = v.compileAnd(v.positive, v.number);
    tables(validator, [1, 0.1, Infinity, 10], [0, -1, -Infinity, "text"]);
    snapshot(validator);
  });
  test("v.compileAnd({ a: v.number }, { b: v.string})", () => {
    const validator = v.compileAnd({ a: v.number }, { b: v.string });
    tables(validator, [{ a: 1, b: "2" }], [{ a: "1", b: "2" }, { a: 1, b: 2 }]);
    snapshot(validator);
  });
});
