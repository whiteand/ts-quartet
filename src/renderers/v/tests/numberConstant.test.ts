import { numberConstantRenderer } from "../numberConstant";
import { snapshot } from "./snapshot";

describe("v constant number renderer", () => {
  test("v(NaN)", () => {
    snapshot(numberConstantRenderer, { schema: 0 / 0 });
  });
  test("v(42)", () => {
    snapshot(numberConstantRenderer, { schema: 42 });
  });
});
