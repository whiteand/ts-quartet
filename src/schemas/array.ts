import { IArraySchema } from "../types";
import { SchemaType } from "./SchemaType";

const ARRAY_SCHEMA: IArraySchema = {
  type: SchemaType.Array,
};

export function array(): IArraySchema {
  return ARRAY_SCHEMA;
}
