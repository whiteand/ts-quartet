import { getNumberValidator } from "../number";
import {
  getNegativeValidator,
  getNonNegativeValidator,
  getNonPositiveValidator,
  getPositiveValidator
} from "../signs";
const isNumber = getNumberValidator({});
const isPositive = getPositiveValidator({});
const isNegative = getNegativeValidator({});
const isNonPositive = getNonPositiveValidator({});
const isNonNegative = getNonNegativeValidator({});
test("number: positive", () => {
  const numbers = [1, 2, 3, 4, 1.5, -5, -6.5, 6, 7, NaN, Infinity, -Infinity];
  for (const n of numbers) {
    expect(isNumber(n)).toBe(true);
  }
});

test("number: negative", () => {
  const notNumbers = [
    "1",
    () => 1,
    {},
    null,
    undefined,
    // tslint:disable-next-line:no-construct
    new Number(10)
  ];
  for (const n of notNumbers) {
    expect(isNumber(n)).toBe(false);
  }
});

test("signs", () => {
  const positive = [1, Infinity, 0.5];
  const negative = [-1, -Infinity, -0.5];
  expect(positive.every(v => isPositive(v))).toBe(true);
  expect([0, ...positive, "1"].every(v => isNegative(v))).toBe(false);
  expect(negative.every(v => isNegative(v))).toBe(true);
  expect([0, ...negative, "1"].every(v => isPositive(v))).toBe(false);
  expect([0, ...positive].every(v => isNonNegative(v))).toBe(true);
  expect([0, ...negative].every(v => isNonPositive(v))).toBe(true);
  expect(["0", ...positive].every(v => isNonPositive(v))).toBe(false);
  expect(["0", ...negative].every(v => isNonNegative(v))).toBe(false);
});
