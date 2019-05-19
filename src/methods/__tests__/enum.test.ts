import { getEnumMethod } from "../enum";

test("enum: positive", () => {
  const a = { a: 1 };
  const b = { b: 2 };
  const c = 1;
  const d = "1";
  const e = null;
  const alphabet = [a, b, c, d, e];
  const enumMethod = getEnumMethod({});
  for (const letter of alphabet) {
    expect(enumMethod(a, b, c, d, e)(letter)).toBe(true);
  }
});

test("enum: negative", () => {
  const a = { a: 1 };
  const b = { b: 2 };
  const c = 1;
  const d = "1";
  const e = null;
  const notAlphabet = [{ a: 1 }, { b: 2 }, 2, "2", undefined];
  const enumMethod = getEnumMethod({});
  for (const letter of notAlphabet) {
    expect(enumMethod(a, b, c, d, e)(letter)).toBe(false);
  }
});
