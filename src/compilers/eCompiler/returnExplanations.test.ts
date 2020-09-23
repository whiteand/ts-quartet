import { returnExplanations } from "./returnExplanations";

describe("return explanations", () => {
  test("primitive", () => {
    expect(returnExplanations(123, x => x, "value", "path", ["// todo"]))
      .toMatchInlineSnapshot(`
      Array [
        "if (value !== c) {",
        "es = [e(value, path)]",
        "// todo",
        "return es",
        "}",
      ]
    `);
  });
});
