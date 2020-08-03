import { e } from "..";
import { testValidatorImpure } from "./testValidatorImpure";

describe("e.custom", () => {
  test("e(e.arrayOf(e.custom(e(e.number))))", () => {
    const checkNumber = e(e.number);
    const checkArrNumber = e(e.arrayOf(e.custom(checkNumber)));
    testValidatorImpure(
      checkArrNumber,
      [[], [1], [1, 2, 3]],
      [null, false, { length: 1, 0: 1 }, ["1"]]
    );
  });
});
