import { IBigIntSchema } from "../types";
import { SchemaType } from "./SchemaType";

const BIGINT_SCHEMA: IBigIntSchema = {
  type: SchemaType.BigInt,
};

export function bigint(): IBigIntSchema {
  return BIGINT_SCHEMA;
}
