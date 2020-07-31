import { undefinedConstantRenderer } from "../undefinedConstant";
import { snapshot } from "./snapshot";

describe("v constant number renderer", () => {
  test("v(undefined)", () => {
    snapshot(undefinedConstantRenderer, { schema: undefined });
  });
});
