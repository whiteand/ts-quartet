import { booleanConstantRenderer } from "../booleanConstant";
import { snapshot } from "./snapshot";

describe("v constant number renderer", () => {
  test("v(true)", () => {
    snapshot(booleanConstantRenderer, { schema: true });
  });
  test("v(false)", () => {
    snapshot(booleanConstantRenderer, { schema: false });
  });
});
