import { getArrayValidator } from "../array";

test("array: positive", () => {
  const arrays = [[], [1, 2], ["1", "2"], [1, "2"]];
  const checkArray = getArrayValidator({});
  for (const arr of arrays) {
    expect(checkArray(arr)).toBe(true);
  }
});

test("array: negative", () => {
  const notArrays = ["Andrew", new Map(), new Set(), {}, null, 1];
  const checkArray = getArrayValidator({});
  for (const arr of notArrays) {
    expect(checkArray(arr)).toBe(false);
  }
});
