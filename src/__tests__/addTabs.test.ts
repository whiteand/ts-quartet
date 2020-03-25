import { addTabs } from "../addTabs";

describe("addTabs", () => {
  test("Default Parameter", () => {
    expect(addTabs("1")).toBe(addTabs("1", 1));
  });
  test("One Tab", () => {
    expect(addTabs("1\n2", 1)).toEqual("  1\n  2");
  })
  test("Two Tab", () => {
    expect(addTabs("1\n2\n3", 2)).toEqual('    1\n    2\n    3');
  })
});
