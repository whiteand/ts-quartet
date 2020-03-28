import { v } from "../index";
import { snapshot } from "./utils";
import { funcSchemas } from "./mocks";

describe("funcSchema", () => {
  test("all func schemas", () => {
    for (const funcSchema of funcSchemas) {
      const validator = v(funcSchema);
      snapshot(validator);
    }
  });
});
