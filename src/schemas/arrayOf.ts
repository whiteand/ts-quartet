import { FromRawSchema } from "../infer";
import { IArrayOfSchema, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function arrayOf<R>(elementSchema: TSchema): IArrayOfSchema & FromRawSchema<R> {
  return {
    type: SchemaType.ArrayOf,
    elementSchema
  } as IArrayOfSchema & FromRawSchema<R>;
}
