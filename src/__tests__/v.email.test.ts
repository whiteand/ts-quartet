import { v } from "../v";
import { testValidator } from "./testValidator";
import { describe } from "vitest";

describe("v.email", (test) => {
  test("v.email", () => {
    testValidator(
      v(v.email),
      ["a@b.com", "vasil.sergiyovych+1@gmail.com"],
      [{}, { length: 10 }, "Andrew"],
    );
  });
  test("{ a: v.email }", () => {
    testValidator(
      v({ a: v.email }),
      ["a@b.com", "vasil.sergiyovych+1@gmail.com"].map((a) => ({ a })),
      [{}, { length: 10 }, "Andrew"].map((a) => ({ a })),
    );
  });
});
