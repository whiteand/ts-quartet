import { IMinLengthSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function minLength(
  minLength: number,
  isExclusive: boolean
): IMinLengthSchema {
  return {
    isExclusive,
    minLength,
    type: SchemaType.MinLength
  };
}
