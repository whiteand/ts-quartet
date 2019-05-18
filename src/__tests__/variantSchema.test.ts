import { quartet } from "../index";
const v = quartet();
test("variant schema: constants", () => {
  const SEX = {
    female: "female",
    male: "male"
  };
  const isSex = v([SEX.female, SEX.male]);
  expect(isSex('male')).toBe(true)
  expect(isSex('female')).toBe(true)
  expect(isSex('Female')).toBe(false)
});
