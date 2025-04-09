import { IMinSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function min(minValue: number, isExclusive: boolean): IMinSchema {
  return {
    isExclusive,
    minValue,
    type: SchemaType.Min,
  };
}
