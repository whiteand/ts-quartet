import { returnExplanations } from "./returnExplanations";

describe("return explanations", () => {
  test("primitive", () => {
    expect(returnExplanations(123, x => x, "value", "path"))
      .toMatchInlineSnapshot(`
      Array [
        "if (value !== c) return [{\\"value\\":value,\\"schema\\":{\\"type\\":\\"Primitive\\",\\"value\\":123},\\"path\\":path,\\"innerExplanations\\":[]}]",
      ]
    `);
  });
});
