import { getThrowErrorMethod } from "./../throwError";
const throwError = getThrowErrorMethod({});

test("throwError is a function", () => {
  expect(typeof throwError).toBe("function");
  const throwIfNotString = throwError<string>(
    v => typeof v === "string",
    "wrong"
  );
  const value: any = 123;
  expect(() => {
    const strValue = throwIfNotString(value);
  }).toThrowError(new TypeError("wrong"));
  expect(throwIfNotString("123")).toBe("123");
});

test("throwError is a function", () => {
  expect(typeof throwError).toBe("function");
  const throwIfNotString = throwError<string>(
    v => typeof v === "string",
    (v: any) => `${v} is wrong`
  );
  const value: any = 123;
  expect(() => {
    const strValue = throwIfNotString(value);
  }).toThrowError(new TypeError("123 is wrong"));
  expect(throwIfNotString("123")).toBe("123");
});
