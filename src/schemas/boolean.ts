import { IBooleanSchema } from "../types";
import { SchemaType } from "./SchemaType";

const BOOLEAN_SCHEMA: IBooleanSchema = {
  type: SchemaType.Boolean
};

export function boolean(): IBooleanSchema {
  return BOOLEAN_SCHEMA;
}
