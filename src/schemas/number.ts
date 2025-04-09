import { INumberSchema } from "../types";
import { SchemaType } from "./SchemaType";

const NUMBER_SCHEMA: INumberSchema = {
  type: SchemaType.Number,
};

export function number(): INumberSchema {
  return NUMBER_SCHEMA;
}
