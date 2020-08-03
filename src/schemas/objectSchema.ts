import { IObjectSchema, KeyType, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function objectSchema(
  propsSchemas: Record<KeyType, TSchema>,
  hasRestValidator: boolean,
  rest: TSchema,
  restOmitDict: Record<KeyType, boolean>
): IObjectSchema {
  return {
    hasRestValidator,
    props: Object.keys(propsSchemas),
    propsSchemas,
    rest,
    restOmitDict,
    type: SchemaType.Object
  };
}
