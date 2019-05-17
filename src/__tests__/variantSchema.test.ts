import { quartet } from "../index";
const v = quartet()
test("variant schema: constants", () => {
  const SEX = {
    male: 'male',
    female: 'female'
  }
  const isSex = v(Object.values(SEX))
})