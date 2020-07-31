import { stringConstantRenderer } from "../stringConstant";
import { snapshot } from "./snapshot";

describe("v constant number renderer", () => {
  test('v("Andrew")', () => {
    snapshot(stringConstantRenderer, { schema: "Andrew" });
  });
  test('v("Andrew is the creator of quartet data validation library. Try to create another long string")', () => {
    snapshot(stringConstantRenderer, {
      schema:
        "Andrew is the creator of quartet data validation library. Try to create another long string"
    });
  });
});
