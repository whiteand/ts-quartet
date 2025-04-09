import { returnExplanations } from "./returnExplanations";
import { describe, expect } from "vitest";

describe("return explanations", (test) => {
  test("primitive", () => {
    expect(
      returnExplanations(123, (x) => x, "value", "path", ["// todo"])
    ).toMatchInlineSnapshot(`
      [
        "if (value !== c) {",
        "es = [e(value, path)]",
        "// todo",
        "return es",
        "}",
      ]
    `);
  });
});
