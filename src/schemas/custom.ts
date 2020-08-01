import { ICustomSchema, TCustomValidator } from "../types";
import { SchemaType } from "./SchemaType";

export function custom(customValidator: TCustomValidator): ICustomSchema {
  return {
    customValidator,
    type: SchemaType.Custom
  };
}
