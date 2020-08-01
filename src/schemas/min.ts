import { IMinSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function min(
  minValue: number,
  isExclusive: boolean = false
): IMinSchema {
  return {
    isExclusive,
    minValue,
    type: SchemaType.Min
  };
}
