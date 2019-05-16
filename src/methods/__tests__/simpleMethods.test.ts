import { methods } from "..";

test("methods is object", () => {
  expect(typeof methods).toBe("object");
  expect(methods).not.toBe(null);
});
