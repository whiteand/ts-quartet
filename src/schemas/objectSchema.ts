import { IObjectSchema, KeyType, TSchema } from "../types";
import { SchemaType } from "./SchemaType";

export function objectSchema(
  propsSchemas: Record<KeyType, TSchema>,
  hasRestValidator: boolean,
  rest: TSchema,
  restOmit: KeyType[]
): IObjectSchema {
  return {
    hasRestValidator,
    props: Object.keys(propsSchemas),
    propsSchemas,
    rest,
    restOmit,
    type: SchemaType.Object
  };
}
