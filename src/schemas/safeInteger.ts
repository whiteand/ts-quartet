import { ISafeIntegerSchema } from "../types";
import { SchemaType } from "./SchemaType";

const SAFE_INTEGER_SCHEMA: ISafeIntegerSchema = {
  type: SchemaType.SafeInteger,
};

export function safeInteger(): ISafeIntegerSchema {
  return SAFE_INTEGER_SCHEMA;
}
