import { getDescription } from "./getDescription";

export function snapshot(validator: any) {
  const description = getDescription(validator);

  expect(description).toMatchSnapshot();
}
export function getExplanation(
  validator: { (arg0: any): void; explanations: any },
  value: any
) {
  validator(value);
  return validator.explanations;
}
export function isValid(validator: (arg0: any) => any, value: any) {
  const valid = validator(value);
  if (!valid) {
    console.log(JSON.stringify(value, null, 2));
  }
  expect(valid).toBe(true);
}
export function isNotValid(validator: (arg0: any) => any, value: any) {
  const valid = validator(value);
  if (valid) {
    console.log(JSON.stringify(value, null, 2));
  }
  expect(valid).toBe(false);
}

export function tables(validator: any, valids: any[], invalids: any[]) {
  for (const valid of valids) {
    isValid(validator, valid);
  }
  for (const invalid of invalids) {
    isNotValid(validator, invalid);
  }
}
