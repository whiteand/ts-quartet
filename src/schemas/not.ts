import { INotSchema, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function not(schema: TSchema): INotSchema {
  return {
    schema,
    type: SchemaType.Not
  };
}
