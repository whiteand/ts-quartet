import { has } from "../has";

describe("has", () => {
  test("has(null, 'Andrew')", () => {
    expect(has(null, "Andrew")).toBe(false);
  });
  test("has({}, 'toString')", () => {
    expect(has({}, "toString")).toBe(false);
  });
  test("has({}, 'toString2')", () => {
    expect(has({}, "toString2")).toBe(false);
  });
  test("has({ toString: 'toString' }, 'toString')", () => {
    expect(has({ toString: "toString" }, "toString")).toBe(true);
  });
  test("has({ a: 1 }, 'a')", () => {
    expect(has({ a: 1 }, "a")).toBe(true);
  });
});
