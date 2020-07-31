import { nullConstantRenderer } from "../nullConstant";
import { snapshot } from "./snapshot";

describe("v constant number renderer", () => {
  test("v(null)", () => {
    snapshot(nullConstantRenderer, { schema: null });
  });
});
