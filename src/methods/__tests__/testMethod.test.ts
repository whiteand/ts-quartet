import { getTestMethod } from "../testMethod";
const testM = getTestMethod({});

test("test is function", () => {
  expect(typeof testM).toBe("function");
});

test("test regex", () => {
  const regex = /^\b\w+\b$/;
  const validWords = ["Andrew", "white", "quartet"];
  expect(validWords.every(word => testM(regex)(word))).toBe(true);
  expect(validWords.every(word => testM(regex)(word + " "))).toBe(false);
});
