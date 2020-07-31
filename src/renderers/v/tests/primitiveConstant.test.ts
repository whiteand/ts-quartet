import { primitiveConstantRenderer } from "../primitiveConstant";
import { snapshot } from "./snapshot";

describe("primitiveConstantRenderer", () => {
  test("v(null)", () => {
    snapshot(primitiveConstantRenderer, { schema: null });
  });
  test("v(undefined)", () => {
    snapshot(primitiveConstantRenderer, { schema: undefined });
  });
  test("v(true)", () => {
    snapshot(primitiveConstantRenderer, { schema: true });
  });
  test("v(false)", () => {
    snapshot(primitiveConstantRenderer, { schema: false });
  });
  test("v(symbol)", () => {
    snapshot(primitiveConstantRenderer, { schema: Symbol.for("quartet") });
  });
  test("v(string)", () => {
    snapshot(primitiveConstantRenderer, { schema: "Andrew" });
  });
  test("v(long string)", () => {
    snapshot(primitiveConstantRenderer, {
      schema:
        "Very very veryVery very veryVery very veryVery very veryVery very very long list"
    });
  });
  test("v(NaN)", () => {
    snapshot(primitiveConstantRenderer, { schema: 0 / 0 });
  });
  test("v(number)", () => {
    snapshot(primitiveConstantRenderer, { schema: 42 });
  });
});
