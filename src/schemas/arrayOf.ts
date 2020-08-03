import { IArrayOfSchema, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function arrayOf(elementSchema: TSchema): IArrayOfSchema {
  return {
    elementSchema,
    type: SchemaType.ArrayOf
  };
}
