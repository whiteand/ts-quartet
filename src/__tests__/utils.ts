import { getDescription } from './getDescription'

export function snapshot(validator: any, makeSnapshot = false) {
  if (!makeSnapshot) return false
  const description = getDescription(validator)

  expect(description).toMatchSnapshot()
}
export function getExplanation(
  validator: { (arg0: any): void; explanations: any },
  value: any,
) {
  validator(value)
  return validator.explanations
}

export function tables(validator: any, valids: any[], invalids: [any, any][]) {
  for (const valid of valids) {
    const isValid = validator(valid)
    expect(isValid ? valid : [valid]).toBe(valid)
    expect(validator.explanations).toEqual([])
  }
  for (const [invalid, explanations] of invalids) {
    const isValid = validator(invalid)
    expect(isValid ? [invalid] : invalid).toBe(invalid)
    expect(validator.explanations).toEqual(explanations)
  }
}
export function puretables(validator: any, valids: any[], invalids: any[]) {
  expect(validator.pure).toBe(true)
  tables(validator, valids, invalids.map(invalid => [invalid, []]))
}
