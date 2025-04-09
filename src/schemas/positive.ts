import { IPositiveSchema } from "../types";
import { SchemaType } from "./SchemaType";

const POSITIVE_SCHEMA: IPositiveSchema = {
  type: SchemaType.Positive,
};

export function positive(): IPositiveSchema {
  return POSITIVE_SCHEMA;
}
