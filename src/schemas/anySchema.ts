import { IAnySchema } from "../types";
import { SchemaType } from "./SchemaType";

const ANY_SCHEMA: IAnySchema = {
  type: SchemaType.Any,
};

export function anySchema(): IAnySchema {
  return ANY_SCHEMA;
}
