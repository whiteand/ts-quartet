import { IMaxSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function max(maxValue: number, isExclusive: boolean): IMaxSchema {
  return {
    isExclusive,
    maxValue,
    type: SchemaType.Max
  };
}
