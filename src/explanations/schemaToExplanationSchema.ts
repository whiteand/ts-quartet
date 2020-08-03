/* tslint:disable:object-literal-sort-keys */
import { SchemaType } from "../schemas";
import { KeyType, TPrimitiveSchema, TSchema } from "../types";
import { ExplanationSchemaType, TExplanationSchema } from "./types";

const SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE = {
  [SchemaType.And]: ExplanationSchemaType.And as ExplanationSchemaType.And,
  [SchemaType.Any]: ExplanationSchemaType.Any as ExplanationSchemaType.Any,
  [SchemaType.Array]: ExplanationSchemaType.Array as ExplanationSchemaType.Array,
  [SchemaType.ArrayOf]: ExplanationSchemaType.ArrayOf as ExplanationSchemaType.ArrayOf,
  [SchemaType.Boolean]: ExplanationSchemaType.Boolean as ExplanationSchemaType.Boolean,
  [SchemaType.Finite]: ExplanationSchemaType.Finite as ExplanationSchemaType.Finite,
  [SchemaType.Function]: ExplanationSchemaType.Function as ExplanationSchemaType.Function,
  [SchemaType.Max]: ExplanationSchemaType.Max as ExplanationSchemaType.Max,
  [SchemaType.MaxLength]: ExplanationSchemaType.MaxLength as ExplanationSchemaType.MaxLength,
  [SchemaType.Min]: ExplanationSchemaType.Min as ExplanationSchemaType.Min,
  [SchemaType.MinLength]: ExplanationSchemaType.MinLength as ExplanationSchemaType.MinLength,
  [SchemaType.Negative]: ExplanationSchemaType.Negative as ExplanationSchemaType.Negative,
  [SchemaType.Never]: ExplanationSchemaType.Never as ExplanationSchemaType.Never,
  [SchemaType.Not]: ExplanationSchemaType.Not as ExplanationSchemaType.Not,
  [SchemaType.NotANumber]: ExplanationSchemaType.NotANumber as ExplanationSchemaType.NotANumber,
  [SchemaType.Number]: ExplanationSchemaType.Number as ExplanationSchemaType.Number,
  [SchemaType.Object]: ExplanationSchemaType.Object as ExplanationSchemaType.Object,
  [SchemaType.Pair]: ExplanationSchemaType.Pair as ExplanationSchemaType.Pair,
  [SchemaType.Positive]: ExplanationSchemaType.Positive as ExplanationSchemaType.Positive,
  [SchemaType.SafeInteger]: ExplanationSchemaType.SafeInteger as ExplanationSchemaType.SafeInteger,
  [SchemaType.String]: ExplanationSchemaType.String as ExplanationSchemaType.String,
  [SchemaType.Symbol]: ExplanationSchemaType.Symbol as ExplanationSchemaType.Symbol,
  [SchemaType.Test]: ExplanationSchemaType.Test as ExplanationSchemaType.Test,
  [SchemaType.Variant]: ExplanationSchemaType.Variant as ExplanationSchemaType.Variant,
  [SchemaType.Custom]: ExplanationSchemaType.Custom as ExplanationSchemaType.Custom
};

export function schemaToExplanationSchema(schema: TSchema): TExplanationSchema {
  if (typeof schema !== "object" || schema === null) {
    return {
      type: ExplanationSchemaType.Primitive,
      value: schema as TPrimitiveSchema
    };
  }
  switch (schema.type) {
    case SchemaType.And:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.And],
        schemas: schema.schemas.map(schemaToExplanationSchema)
      };
    case SchemaType.Any:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Any]
      };
    case SchemaType.Array:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Array]
      };
    case SchemaType.ArrayOf:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.ArrayOf],
        elementSchema: schemaToExplanationSchema(schema.elementSchema)
      };
    case SchemaType.Boolean:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Boolean]
      };
    case SchemaType.Finite:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Finite]
      };
    case SchemaType.Function:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Function]
      };
    case SchemaType.Max:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Max],
        maxValue: schema.maxValue,
        isExclusive: schema.isExclusive
      };
    case SchemaType.MaxLength:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.MaxLength],
        maxLength: schema.maxLength,
        isExclusive: schema.isExclusive
      };
    case SchemaType.Min:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Min],
        minValue: schema.minValue,
        isExclusive: schema.isExclusive
      };
    case SchemaType.MinLength:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.MinLength],
        minLength: schema.minLength,
        isExclusive: schema.isExclusive
      };
    case SchemaType.Negative:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Negative]
      };
    case SchemaType.Never:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Never]
      };
    case SchemaType.Not:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Not],
        schema: schemaToExplanationSchema(schema.schema)
      };
    case SchemaType.NotANumber:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.NotANumber]
      };
    case SchemaType.Number:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Number]
      };
    case SchemaType.Object:
      const propsSchemas: Record<KeyType, TExplanationSchema> = Object.create(
        null
      );
      const { props } = schema;
      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        propsSchemas[prop] = schemaToExplanationSchema(
          schema.propsSchemas[prop as string]
        );
      }
      if (!schema.hasRestValidator) {
        return {
          type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Object],
          propsSchemas
        };
      }
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Object],
        propsSchemas,
        "[v.rest]": schemaToExplanationSchema(schema.rest),
        "[v.restOmit]": Object.keys(schema.restOmitDict)
      };
    case SchemaType.Pair:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Pair],
        keyValueSchema: schemaToExplanationSchema(schema.keyValueSchema)
      };
    case SchemaType.Positive:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Positive]
      };
    case SchemaType.SafeInteger:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.SafeInteger]
      };
    case SchemaType.String:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.String]
      };
    case SchemaType.Symbol:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Symbol]
      };
    case SchemaType.Test:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Test],
        tester: schema.tester
      };
    case SchemaType.Variant:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Variant],
        variants: schema.variants.map(schemaToExplanationSchema)
      };
    case SchemaType.Custom:
      return {
        type: SCHEMA_TYPE_TO_EXPLANATION_SCHEMA_TYPE[SchemaType.Custom],
        customValidator: schema.customValidator
      };
  }
}
