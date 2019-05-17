import { IKeyParentSchema, InstanceSettings, Validator } from "../global";
import quartet from "../index";

test("quartet is function", () => {
  expect(typeof quartet).toBe("function");
});

test("constant validations", () => {
  const v = quartet();
  expect(typeof v).toBe("function");
  expect(v("string")("str")).toBe(false);
  expect(v("string")("string")).toBe(true);
  expect(v(1)(2)).toBe(false);
  expect(v(1)(1)).toBe(true);
  expect(v(null)({})).toBe(false);
  expect(v(null)(null)).toBe(true);
  expect(v(undefined)(2)).toBe(false);
  expect(v(undefined)(undefined)).toBe(true);
  expect(v(true)(false)).toBe(false);
  expect(v(true)(true)).toBe(true);
  expect(v(false)(true)).toBe(false);
  expect(v(false)(false)).toBe(true);
  const symbol = Symbol.for("test");
  expect(v(symbol)(2)).toBe(false);
  expect(v(symbol)(symbol)).toBe(true);
});

test("function schema", () => {
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
  const isOneEven = checkEven(1);
  expect(isOneEven).toBe(false);
  expect(lastArgs).toEqual({
    explanations: [],
    parents: [],
    value: 1
  });
  const isTwoEven = checkEven(2);
  expect(isTwoEven).toBe(true);
  expect(lastArgs).toEqual({
    explanations: [],
    parents: [],
    value: 2
  });
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
