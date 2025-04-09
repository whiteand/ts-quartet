import { IFromRawSchema } from "../infer";
import { ITester, ITestSchema, Z } from "../types";
import { SchemaType } from "./SchemaType";

export function testSchema<const T extends ITester>(
  tester: T,
): ITestSchema & IFromRawSchema<T> {
  return {
    tester,
    type: SchemaType.Test,
  } as Z as ITestSchema & IFromRawSchema<T>;
}
