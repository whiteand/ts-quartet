import { quartet } from "../index";
import { Schema } from "../types";
const v = quartet();
test("variant schema: constants", () => {
  const SEX = {
    female: "female",
    male: "male"
  };
  const isSex = v([SEX.female, SEX.male]);
  expect(isSex("male")).toBe(true);
  expect(isSex("female")).toBe(true);
  expect(isSex("Female")).toBe(false);
});


test("calculation: short", () => {
  const TRUE = jest.fn(() => true)
  const FALSE = jest.fn(() => false)
  expect(v([TRUE, FALSE])(1)).toBe(true)
  expect(TRUE).toBeCalledTimes(1)
  expect(FALSE).toBeCalledTimes(0)
})

test("calculation: full", () => {
  const TRUE = jest.fn(() => true)
  const FALSE = jest.fn(() => false)
  expect(v([FALSE, TRUE])(1)).toBe(true)
  expect(TRUE).toBeCalledTimes(1)
  expect(FALSE).toBeCalledTimes(1)
})

test("calculation: empty", () => {
  expect(v([])(1)).toBe(false)
})

test("explanations", () => {
  const passedExplanations: any[] = []
  const isValid = v([(value, explanations) => {
    if (value <= 0 && explanations) {
      explanations.push('less-than-zero')
    }
    return value > 0
  }])
  expect(isValid(1, passedExplanations)).toBe(true)
  expect(isValid(-1, passedExplanations)).toBe(false)
  expect(passedExplanations).toEqual(['less-than-zero'])
})

test("Removed unnecessary explanations", () => {
  const isValid = v([
    v(value => value === null, (value: any) => `${value} is not null`),
    v(value => typeof value === 'string', (value: any) => `${value} is not string`)
  ])
  const explanations: any[] = []
  expect(isValid(null, explanations)).toBe(true)
  expect(isValid('string', explanations)).toBe(true)
  expect(explanations).toEqual([])
  expect(isValid(1, explanations)).toBe(false)
  expect(explanations).toEqual([
    '1 is not null',
    '1 is not string'
  ])
})

test("parents", () => {
  let actualParents: any = null
  const schema: Schema = {
    a: [null, (value, e, parents) => {
      actualParents = parents
      return typeof value === 'string'
    }]
  }
  const firstValue = {
    a: null
  }
  const secondValue = {
    a: 'andrew'
  }
  const isValid = v(schema)
  expect(isValid(firstValue)).toBe(true)
  expect(isValid(secondValue)).toBe(true)
  expect(actualParents).toEqual([
    {
      key: 'a',
      parent: secondValue,
      schema
    }
  ])

})