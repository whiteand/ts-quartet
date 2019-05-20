import { getExplainMethod } from "./../explain";
const explain = getExplainMethod({
  allErrors: true
});
test("explain: positive", () => {
  const isValidNumber = explain(
    (value: any) => typeof value === "number",
    (value: any) => `${value} is not a number`
  );
  for (let i = 0; i < 10; i += 10) {
    expect(isValidNumber(i)).toBe(null);
  }
});

test("explain: positive", () => {
  const isValidNumber = explain(
    (value: any) => typeof value === "number",
    (value: any) => `${value} is not a number`
  );
  for (let i = 0; i < 10; i += 10) {
    expect(isValidNumber(i.toString())).toEqual([`${i} is not a number`]);
  }
});
