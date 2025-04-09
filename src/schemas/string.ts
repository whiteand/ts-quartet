import { IStringSchema } from "../types";
import { SchemaType } from "./SchemaType";

const STRING_SCHEMA: IStringSchema = {
  type: SchemaType.String,
};

export function string(): IStringSchema {
  return STRING_SCHEMA;
}
