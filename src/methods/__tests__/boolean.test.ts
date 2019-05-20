import { getBooleanValidator } from "../boolean";
const isBoolean = getBooleanValidator({});
test("boolean: positive", () => {
  const booleans = [true, false];
  for (const b of booleans) {
    expect(isBoolean(b)).toBe(true);
  }
});

test("boolean: negative", () => {
  const notBooleans = [
    1,
    "1",
    new Boolean(true),
    () => 1,
    {},
    null,
    undefined,
    // tslint:disable-next-line:no-construct
    new String("123")
  ];
  for (const notB of notBooleans) {
    expect(isBoolean(notB)).toBe(false);
  }
});
