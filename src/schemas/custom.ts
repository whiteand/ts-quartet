import { ICustomSchema, TCustomValidator } from "../types";
import { SchemaType } from "./SchemaType";

export function custom(customValidator: TCustomValidator, description?: string): ICustomSchema {
  return {
    customValidator,
    description,
    type: SchemaType.Custom
  };
}
