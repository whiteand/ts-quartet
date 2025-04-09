import { IMaxLengthSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function maxLength(
  maxLength: number,
  isExclusive: boolean,
): IMaxLengthSchema {
  return {
    isExclusive,
    maxLength,
    type: SchemaType.MaxLength,
  };
}
