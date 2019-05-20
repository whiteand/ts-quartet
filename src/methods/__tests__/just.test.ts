import { getJustMethod } from "./../just";
const just = getJustMethod({});
test("just number", () => {
  const isNumber = just<number>(value => typeof value === "number");
  const value: any = 1;
  if (isNumber(value)) {
    expect(value + 1).toBe(2);
  } else {
    expect(true).toBe(false);
  }
});
