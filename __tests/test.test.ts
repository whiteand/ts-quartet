import { v } from "../index";
import { tables, snapshot } from "./utils";

describe("test", () => {
  test("regular expression", () => {
    const isUpperCased = v(v.test(/^[ .,A-Z]*$/));
    tables(
      isUpperCased,
      ["", "ANDREW", "ANDREW BELETSKIY"],
      ["Andrew", "ANDREW BELETSKIY!"]
    );
    snapshot(isUpperCased);
  });
});
