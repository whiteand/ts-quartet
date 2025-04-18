import { beautifyStatements } from "../compilers/beautifyStatements";
import { describe, expect } from "vitest";

describe("beautifyStatements", (test) => {
  test("simple with default tab size", () => {
    expect(
      beautifyStatements(["if (true) {", 'console.log("something")', "}"]).join(
        "\n",
      ),
    ).toEqual(`  if (true) {\n    console.log("something")\n  }`);
  });
  test("simple with non default tab size", () => {
    expect(
      beautifyStatements(
        ["if (true) {", 'console.log("something")', "}"],
        0,
      ).join("\n"),
    ).toEqual(`if (true) {\n  console.log("something")\n}`);
  });
});
