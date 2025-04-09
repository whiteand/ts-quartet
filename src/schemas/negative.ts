import { INegativeSchema } from "../types";
import { SchemaType } from "./SchemaType";

const NEGATIVE_SCHEMA: INegativeSchema = {
  type: SchemaType.Negative,
};

export function negative(): INegativeSchema {
  return NEGATIVE_SCHEMA;
}
