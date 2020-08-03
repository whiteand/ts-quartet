import { IFiniteSchema } from "../types";
import { SchemaType } from "./SchemaType";

const FINITE_SCHEMA: IFiniteSchema = {
  type: SchemaType.Finite
};

export function finite(): IFiniteSchema {
  return FINITE_SCHEMA;
}
