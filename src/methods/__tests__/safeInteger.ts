import { getSafeIntegerValidator } from "../safeInteger";
const isSafeInteger = getSafeIntegerValidator({});
test("safeInteger: positive", () => {
  const safeIntegers = [1, 2, 3, 4, -5, 6, 7];
  for (const n of safeIntegers) {
    expect(isSafeInteger(n)).toBe(true);
  }
});

test("safeInteger: negative", () => {
  const notSafeIntegers = [
    "1",
    1.5,
    -1.5,
    Infinity,
    -Infinity,
    NaN,
    () => 1,
    {},
    null,
    undefined,
    // tslint:disable-next-line:no-construct
    new Number(10)
  ];
  for (const n of notSafeIntegers) {
    expect(isSafeInteger(n)).toBe(false);
  }
});
