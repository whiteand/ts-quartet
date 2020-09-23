import { IAndSchema, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function and(schemas: TSchema[]): IAndSchema {
  return {
    schemas,
    type: SchemaType.And
  };
}
