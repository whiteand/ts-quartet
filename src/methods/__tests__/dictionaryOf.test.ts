import { getDictionaryOfMethod } from "../dictionaryOf";
import { v } from "../../index";
import {
  FromValidationParams,
  TypeGuardValidator,
  Validator
} from "../../types";

const dictionaryOf = getDictionaryOfMethod({ allErrors: true });
test("dictionaryOf: positive", () => {
  const isNumberDict = dictionaryOf(value => typeof value === "number");
  const numberDicts = [{}, { a: 1 }, { b: 3, c: 4 }, [1, 2, 3, 4]];
  for (const numberDict of numberDicts) {
    expect(isNumberDict(numberDict)).toBe(true);
  }
});

test("dictionaryOf: negative", () => {
  const isNumberDict = dictionaryOf(value => typeof value === "number");
  const notNumberDicts = [
    1,
    null,
    undefined,
    "Andrew",
    { a: 1, b: "3" },
    { d: "1" }
  ];

  for (const notANumberDict of notNumberDicts) {
    expect(isNumberDict(notANumberDict)).toBe(false);
  }
});

test("dictionaryOf: explanations and parents", () => {
  let actualParentsInValidator: any[] = [];
  let actualParentsInExplanation: any[] = [];
  const explanation: FromValidationParams = (
    value: any,
    schema,
    settings,
    parents
  ) => {
    actualParentsInExplanation = parents || [];
    return `${value} is not a number`;
  };
  const isNumberValidator: Validator = (
    value: any,
    exp: any[] = [],
    parents = []
  ) => {
    actualParentsInValidator = parents;
    return typeof value === "number";
  };
  const isNumber = v<number>(isNumberValidator, explanation);
  const explanations: any[] = [];
  const invalidNumberDict = {
    a: "1"
  };
  const isNumberDict = dictionaryOf(isNumber);
  expect(isNumberDict(invalidNumberDict, explanations)).toBe(false);
  expect(explanations).toEqual(["1 is not a number"]);
  expect(actualParentsInValidator).toEqual([
    {
      key: "a",
      parent: invalidNumberDict,
      schema: isNumberDict
    }
  ]);
  expect(actualParentsInExplanation).toEqual([
    {
      key: "a",
      parent: invalidNumberDict,
      schema: isNumberDict
    }
  ]);
  expect(
    [
      actualParentsInExplanation[0].parent,
      actualParentsInValidator[0].parent
    ].every(e => e === invalidNumberDict)
  ).toBe(true);
});
