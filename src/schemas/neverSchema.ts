import { INeverSchema } from "../types";
import { SchemaType } from "./SchemaType";

const NEVER_SCHEMA: INeverSchema = {
  type: SchemaType.Never,
};

export function neverSchema(): INeverSchema {
  return NEVER_SCHEMA;
}
