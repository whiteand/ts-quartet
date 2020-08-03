import { ITester, ITestSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function testSchema(tester: ITester): ITestSchema {
  return {
    tester,
    type: SchemaType.Test
  };
}
