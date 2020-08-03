import { EMPTY_OBJ } from "../empty";
import { IObjectSchema, KeyType, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function objectSchemaWithRest(
  propsSchemas: Record<KeyType, TSchema>,
  rest: TSchema,
  restOmitDict: Record<KeyType, boolean>
): IObjectSchema {
  return {
    hasRestValidator: true,
    props: Object.keys(propsSchemas),
    propsSchemas,
    rest,
    restOmitDict,
    type: SchemaType.Object
  };
}
export function objectSchemaWithoutRest(
  propsSchemas: Record<KeyType, TSchema>
): IObjectSchema {
  return {
    hasRestValidator: false,
    props: Object.keys(propsSchemas),
    propsSchemas,
    rest: null,
    restOmitDict: EMPTY_OBJ,
    type: SchemaType.Object
  };
}
