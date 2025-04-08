import { IAndSchema, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function and(schemas: TSchema[]): IAndSchema {
  return {
    type: SchemaType.And,
    schemas
  };
}
