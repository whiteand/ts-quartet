import { IMaxLengthSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function maxLength(
  maxLength: number,
  isExclusive: boolean = false
): IMaxLengthSchema {
  return {
    isExclusive,
    maxLength,
    type: SchemaType.MaxLength
  };
}
