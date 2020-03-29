import { IAndSchema } from "./types";

export const AND_SCHEMA_ID: "__quartet/and__" = "__quartet/and__";

export function isAndSchema(schema: any): schema is IAndSchema {
  return schema && Array.isArray(schema) && schema[0] === AND_SCHEMA_ID;
}
