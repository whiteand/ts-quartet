import { v } from "../index";
import { compileIfNotValidReturnFalse } from "../compileIfNotValidReturnFalse";
import { funcSchemaWithNot } from "./mocks";

describe("compileIfNotValidReturnFalse", () => {
  const preparations: any[] = [];
  expect(
    compileIfNotValidReturnFalse(
      v,
      "value",
      "validator",
      { [v.rest]: funcSchemaWithNot },
      preparations
    )
  ).toMatchInlineSnapshot();
  expect(preparations.map(e => e.toString())).toMatchInlineSnapshot();
});
