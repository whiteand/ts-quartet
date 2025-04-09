import { IFromRawSchema } from "../infer";
import { IArrayOfSchema, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function arrayOf<R>(
  elementSchema: TSchema,
): IArrayOfSchema & IFromRawSchema<R> {
  return {
    type: SchemaType.ArrayOf,
    elementSchema,
  } as IArrayOfSchema & IFromRawSchema<R>;
}
