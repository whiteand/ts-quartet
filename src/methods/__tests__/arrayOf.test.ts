import { getArrayOfValidator } from "../arrayOf";
import { IKeyParentSchema } from "../../types";
const arrayOf = getArrayOfValidator({});

test("negative", () => {
  const notNumberArrays = ["Andrew", 1, new Set(), new Map(), [1, 2, "3"]];
  const isNumberArray = arrayOf(value => typeof value === "number");
  for (const notArr of notNumberArrays) {
    expect(isNumberArray(notArr)).toBe(false);
  }
});

test("positive", () => {
  const numberArrays = [[], [1, 2, 3]];
  const isNumberArray = arrayOf(value => typeof value === "number");
  for (const numberArr of numberArrays) {
    expect(isNumberArray(numberArr)).toBe(true);
  }
});

test("explanations", () => {
  let e: any[] | null = null;

  const isNumberArray = arrayOf((value, explanations) => {
    e = explanations || [];
    return typeof value === "number";
  });

  const passedExp = [1];

  expect(isNumberArray([1, 2, 3, 4], passedExp)).toBe(true);

  expect(e).toBe(passedExp);
});


test("parents", () => {
  const parent = [1,2,3,4]
  let actualParents: IKeyParentSchema[] = []
  const isNumberArray = arrayOf((value, explanations, parents) => {
    actualParents = parents || []
    return typeof value === 'number'
  })
  expect(isNumberArray(parent)).toBe(true)
  expect(actualParents).toEqual([
    { key: 3, parent, schema: isNumberArray }
  ])
  
})