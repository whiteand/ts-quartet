import { IVariantSchema, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function variant(variants: TSchema[]): IVariantSchema {
  return {
    type: SchemaType.Variant,
    variants,
  };
}
