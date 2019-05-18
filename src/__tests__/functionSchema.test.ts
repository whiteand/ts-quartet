import { quartet } from "../index";
import { IKeyParentSchema, InstanceSettings, Validator } from "../types";
const v = quartet();
let lastArgs: {
  value: any;
  explanations?: any[];
  parents?: IKeyParentSchema[];
  settings?: InstanceSettings;
} | null = null;

const isEven: Validator = (value, explanations, parents) => {
  lastArgs = {
    explanations,
    parents,
    value
  };
  return value % 2 === 0;
};
const checkEven = v(isEven);

test("function schema: negative", () => {
  const isOneEven = checkEven(1);
  expect(isOneEven).toBe(false);
  expect(lastArgs).toEqual({
    explanations: [],
    parents: [],
    value: 1
  });
});

test("function schema: positive", () => {
  const isTwoEven = checkEven(2);
  expect(isTwoEven).toBe(true);
  expect(lastArgs).toEqual({
    explanations: [],
    parents: [],
    value: 2
  });
});
test("function schema: undefined passed", () => {
  const parent = {};
  expect(
    v({
      evenNumber: isEven
    })(parent)
  ).toEqual(false);
  expect(lastArgs).toEqual({
    explanations: [],
    parents: [{ key: "evenNumber", parent, schema: { evenNumber: isEven } }],
    value: undefined
  });
});
test("function schema: parents passed", () => {
  const parent2 = { evenNumber: 2 };
  expect(
    v({
      evenNumber: isEven
    })(parent2)
  ).toEqual(true);
  expect(lastArgs).toEqual({
    explanations: [],
    parents: [
      { key: "evenNumber", parent: parent2, schema: { evenNumber: isEven } }
    ],
    value: 2
  });
});
test("function schema: explanation passed", () => {
  const parent3 = { evenNumber: 3 };
  expect(
    v({
      evenNumber: isEven
    })(parent3, [1])
  ).toEqual(false);
  expect(lastArgs).toEqual({
    explanations: [1],
    parents: [
      { key: "evenNumber", parent: parent3, schema: { evenNumber: isEven } }
    ],
    value: 3
  });
});
