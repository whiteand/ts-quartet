import { getStringValidator } from "../string";
const isString = getStringValidator({});
test("string: positive", () => {
  const strings = ["", "1"];
  for (const s of strings) {
    expect(isString(s)).toBe(true);
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
  for (const notS of notStrings) {
    expect(isString(notS)).toBe(false);
  }
});
