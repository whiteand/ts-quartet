import { v } from "../index";
import { tables, snapshot } from "./utils";

describe("not", () => {
  test("constant", () => {
    const checkNot42 = v(v.not(42));
    tables(checkNot42, [41, "42", 43, null, false], [42]);
    snapshot(checkNot42);
  });
});
