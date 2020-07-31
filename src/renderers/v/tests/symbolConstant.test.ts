import { symbolConstantRenderer } from "../symbolConstant";
import { snapshot } from "./snapshot";

describe("v constant number renderer", () => {
  test("v(Symbol.for('quartet'))", () => {
    snapshot(symbolConstantRenderer, { schema: Symbol.for("Andrew") });
  });
});
