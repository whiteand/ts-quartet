import { getStringValidator } from "../string";
const isString = getStringValidator({});
test("string: positive", () => {
  const strings = ["", "1"];
  for (const n of strings) {
    expect(isString(n)).toBe(true);
  }
});

test("string: negative", () => {
  const notStrings = [
    1,
    () => 1,
    {},
    null,
    undefined,
    // tslint:disable-next-line:no-construct
    new String("123")
  ];
  for (const n of notStrings) {
    expect(isString(n)).toBe(false);
  }
});
