import { obj } from "../index";
test("obj: positive", () => {
  const e: any[] = [];
  obj.number(1, e);
  expect(e).toEqual([]);
});

test("obj: negative", () => {
  const e: any[] = [];
  obj.number("1", e);
  expect(e.length).toEqual(1);
  const [{ id, parents, schema, settings, value }] = e;
  expect(typeof id).toBe("number");
  expect(parents).toEqual([]);
  expect(schema).toBe(obj.number);
  expect(settings.allErrors).toBe(true);
  expect(typeof settings.defaultExplanation).toBe("function");
  expect(value).toBe("1");
});
