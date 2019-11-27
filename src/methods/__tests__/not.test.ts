import { getNotMethod } from "../not";
import { IKeyParentSchema } from "../../types";

const not = getNotMethod({});

test("not is function", () => {
  expect(typeof not).toBe("function");
});

test("not positive", () => {
  const isObjWithAString = not({ a: value => typeof value === "string" });
  expect(isObjWithAString({ a: "string " })).toBe(false);
});
test("not negative", () => {
  const isObjWithAString = not({ a: value => typeof value === "string" });
  expect(isObjWithAString({ a: 1 })).toBe(true);
});
test("not explanation", () => {
  const isObjWithAString = not(
    { a: value => typeof value === "string" },
    "Have a: string"
  );
  const explanations: string[] = [];
  isObjWithAString({ a: "1" }, explanations);

  expect(explanations).toEqual(["Have a: string"]);
  expect(isObjWithAString({ a: 1 })).toBe(true);
});

test("not access to parents", () => {
  const parent = ["1", "2", "3", "4"];
  let actualParents: IKeyParentSchema[] = [];
  const notANumber = not((value, explanations, parents) => {
    actualParents = parents || [];
    if (explanations && typeof value === "number") {
      explanations.push("something");
    }
    return typeof value === "number";
  });
  const explanations: string[] = [];
  expect(
    notANumber(1, explanations, [
      { parent: parent, key: 0, schema: { type: { 0: notANumber } } }
    ])
  ).toBe(false);
  expect(explanations).toEqual([]);
  expect(actualParents).toEqual([
    { parent: parent, key: 0, schema: { type: { 0: notANumber } } }
  ]);
});
