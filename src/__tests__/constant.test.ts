import { v } from "../index";
import { snapshot, puretables } from "./utils";
import { primitives } from "./mocks";

describe("constant", () => {
  test("NaN", () => {
    const validator = v(NaN);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [NaN], [...primitives.filter(e => !Number.isNaN(e))]);
  });
  test("42", () => {
    const validator = v(42);
    expect(validator.pure).toBe(true);
    snapshot(validator);
    puretables(validator, [42], [...primitives]);
  });
});
