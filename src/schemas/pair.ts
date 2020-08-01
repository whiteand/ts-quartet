import { IPairSchema, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function pair(keyValueSchema: TSchema): IPairSchema {
  return {
    keyValueSchema,
    type: SchemaType.Pair
  };
}
