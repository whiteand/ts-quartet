import { EMPTY_ARR } from "./empty";
import {
  neverSchema,
  objectSchema,
  SchemaType,
  variant as variantSchema
} from "./schemas";
import { SpecialProp } from "./schemas/SpecialProp";
import { KeyType, TSchema } from "./types";
import { arrToDict, has } from "./utils";

interface IRawSchemaArr extends Array<RawSchema> {}

interface IRawSchemaDict extends Record<KeyType, RawSchema> {}

export type RawSchema =
  | TSchema
  | IRawSchemaArr
  | (IRawSchemaDict & {
      [SpecialProp.Rest]?: RawSchema;
      [SpecialProp.RestOmit]?: KeyType[];
    });

const schemaTypeDict = arrToDict(Object.values(SchemaType));

function rawPropsSchemasToPropsSchemas(
  rawPropsSchemas: IRawSchemaDict
): Record<KeyType, TSchema> {
  const propsSchemas = Object.create(null);
  const keys = Object.keys(rawPropsSchemas);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const rawSchema = rawPropsSchemas[key];
    const schema = rawSchemaToSchema(rawSchema);
    propsSchemas[key] = schema;
  }
  return propsSchemas;
}

export function rawSchemaToSchema(rawSchema: RawSchema): TSchema {
  if (rawSchema == null) {
    return rawSchema as null | undefined;
  }
  if (typeof rawSchema !== "object") {
    return rawSchema;
  }
  if (Array.isArray(rawSchema)) {
    if (rawSchema.length === 0) {
      return neverSchema();
    }
    if (rawSchema.length === 1) {
      return rawSchemaToSchema(rawSchema[0]);
    }
    const variants: TSchema[] = [];
    for (let i = 0; i < rawSchema.length; i++) {
      const rawVariant = rawSchema[i];
      const variant = rawSchemaToSchema(rawVariant);
      variants.push(variant);
    }
    return variantSchema(variants);
  }
  if (
    has(rawSchema, "type") &&
    schemaTypeDict[rawSchema.type as SchemaType] === true
  ) {
    return rawSchema as TSchema;
  }
  if (has(rawSchema, SpecialProp.Rest)) {
    if (has(rawSchema, SpecialProp.RestOmit)) {
      const {
        [SpecialProp.Rest]: rawRest,
        [SpecialProp.RestOmit]: restOmit,
        ...rawPropsSchemas
      } = rawSchema as any;
      const restSchema = rawSchemaToSchema(rawRest);
      const propsSchemas = rawPropsSchemasToPropsSchemas(
        rawPropsSchemas as Record<KeyType, RawSchema>
      );
      return objectSchema(propsSchemas, true, restSchema, restOmit);
    }
    const {
      [SpecialProp.Rest]: rawRest,
      ...rawPropsSchemas
    } = rawSchema as any;
    const restSchema = rawSchemaToSchema(rawRest);
    const propsSchemas = rawPropsSchemasToPropsSchemas(
      rawPropsSchemas as Record<KeyType, RawSchema>
    );
    return objectSchema(propsSchemas, true, restSchema, EMPTY_ARR);
  }
  if (has(rawSchema, SpecialProp.RestOmit)) {
    const {
      [SpecialProp.RestOmit]: restOmit,
      ...rawPropsSchemas
    } = rawSchema as any;
    const propsSchemas = rawPropsSchemasToPropsSchemas(
      rawPropsSchemas as Record<KeyType, RawSchema>
    );
    return objectSchema(propsSchemas, false, null, EMPTY_ARR);
  }
  const propsSchemas = rawPropsSchemasToPropsSchemas(rawSchema as Record<
    KeyType,
    RawSchema
  >);
  return objectSchema(propsSchemas, false, null, EMPTY_ARR);
}
