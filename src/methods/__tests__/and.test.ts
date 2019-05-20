import { getAndMethod } from "../and";
import { IKeyParentSchema } from "../../types";

const and = getAndMethod({});

test("and is function", () => {
  expect(typeof and).toBe("function");
});

test("and: empty", () => {
  expect(and()("1")).toBe(true);
});

test("and: right values", () => {
  const TRUE = jest.fn(() => true);
  const FALSE = jest.fn(() => false);
  expect(and(FALSE, FALSE)(undefined)).toBe(false);
  expect(FALSE).toBeCalledTimes(1);
  expect(and(FALSE, TRUE)()).toBe(false);
  expect(FALSE).toBeCalledTimes(2);
  expect(TRUE).toBeCalledTimes(0);
  expect(and(TRUE, FALSE)()).toBe(false);
  expect(FALSE).toBeCalledTimes(3);
  expect(TRUE).toBeCalledTimes(1);
  expect(and(TRUE, TRUE)()).toBe(true);
  expect(FALSE).toBeCalledTimes(3);
  expect(TRUE).toBeCalledTimes(3);
});

test("and: explanations", () => {
  const FALSE = jest.fn((v: any, explanations: any[] = []) => {
    explanations.push("1");
    return false;
  });
  const explanations: any = [];
  expect(and(FALSE)(undefined, explanations)).toBe(false);
  expect(explanations).toEqual(["1"]);
});

test("and: parents", () => {
  let actualParents: any[] = [];
  const FALSE = jest.fn((v: any, explanations: any[] = []) => {
    explanations.push("1");
    return false;
  });
  const obj = { posnum: 1 };
  const schema = {
    posnum: and(
      (value: any, explanations?: any, parents: IKeyParentSchema[] = []) => {
        actualParents = parents;
        return typeof value === "number";
      },
      (value: any) => value > 0
    )
  };
  const checkObj = and(schema);
  expect(checkObj(obj)).toBe(true);
  expect(actualParents).toEqual([
    {
      key: "posnum",
      parent: obj,
      schema
    }
  ]);
});
