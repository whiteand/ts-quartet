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

export function tables(validator: any, valids: any[], invalids: [any, any][]) {
  for (const valid of valids) {
    expect(validator(valid)).toBe(true)
    expect(validator.explanations).toEqual([])
  }
  for (const [invalid, explanations] of invalids) {
    expect(validator(invalid)).toBe(false)
    expect(validator.explanations).toEqual(explanations)
  }
}
export function puretables(validator: any, valids: any[], invalids: any[]) {
  expect(validator.pure).toBe(true)
  tables(validator, valids, invalids.map(invalid => [invalid, []]))
}
