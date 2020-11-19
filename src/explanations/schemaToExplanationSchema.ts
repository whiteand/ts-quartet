/* tslint:disable:object-literal-sort-keys */
import { SchemaType } from "../schemas";
import { KeyType, TSchema } from "../types";
import { ExplanationSchemaType, TExplanationSchema } from "./types";

function getCustomValidatorDescription(customVailidator: any): string {
  if (typeof customVailidator.description === "string") {
    return customVailidator.description;
  }
  return customVailidator.name || "custom";
}

function getTesterDescription(tester: any): string {
  if (typeof tester.description === "string") {
    return tester.description;
  }
  if (typeof tester.name === "string") {
    return tester.name;
  }
  if (typeof tester.toString === "function") {
    return tester.toString();
  }
  return "tester";
}

export function schemaToExplanationSchema(schema: TSchema): TExplanationSchema {
  if (typeof schema !== "object" || schema === null) {
    return schema;
  }
  switch (schema.type) {
    case SchemaType.And:
      return {
        type: ExplanationSchemaType.And,
        schemas: schema.schemas.map(schemaToExplanationSchema)
      };
    case SchemaType.Any:
      return {
        type: ExplanationSchemaType.Any
      };
    case SchemaType.Array:
      return {
        type: ExplanationSchemaType.Array
      };
    case SchemaType.ArrayOf:
      return {
        type: ExplanationSchemaType.ArrayOf,
        elementSchema: schemaToExplanationSchema(schema.elementSchema)
      };
    case SchemaType.Boolean:
      return {
        type: ExplanationSchemaType.Boolean
      };
    case SchemaType.Finite:
      return {
        type: ExplanationSchemaType.Finite
      };
    case SchemaType.Function:
      return {
        type: ExplanationSchemaType.Function
      };
    case SchemaType.Max:
      return {
        type: ExplanationSchemaType.Max,
        maxValue: schema.maxValue,
        isExclusive: schema.isExclusive
      };
    case SchemaType.MaxLength:
      return {
        type: ExplanationSchemaType.MaxLength,
        maxLength: schema.maxLength,
        isExclusive: schema.isExclusive
      };
    case SchemaType.Min:
      return {
        type: ExplanationSchemaType.Min,
        minValue: schema.minValue,
        isExclusive: schema.isExclusive
      };
    case SchemaType.MinLength:
      return {
        type: ExplanationSchemaType.MinLength,
        minLength: schema.minLength,
        isExclusive: schema.isExclusive
      };
    case SchemaType.Negative:
      return {
        type: ExplanationSchemaType.Negative
      };
    case SchemaType.Never:
      return {
        type: ExplanationSchemaType.Never
      };
    case SchemaType.Not:
      return {
        type: ExplanationSchemaType.Not,
        schema: schemaToExplanationSchema(schema.schema)
      };
    case SchemaType.NotANumber:
      return {
        type: ExplanationSchemaType.NotANumber
      };
    case SchemaType.Number:
      return {
        type: ExplanationSchemaType.Number
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
          type: ExplanationSchemaType.Object,
          propsSchemas
        };
      }
      return {
        type: ExplanationSchemaType.Object,
        propsSchemas,
        "[v.rest]": schemaToExplanationSchema(schema.rest),
        "[v.restOmit]": Object.keys(schema.restOmitDict)
      };
    case SchemaType.Pair:
      return {
        type: ExplanationSchemaType.Pair,
        keyValueSchema: schemaToExplanationSchema(schema.keyValueSchema)
      };
    case SchemaType.Positive:
      return {
        type: ExplanationSchemaType.Positive
      };
    case SchemaType.SafeInteger:
      return {
        type: ExplanationSchemaType.SafeInteger
      };
    case SchemaType.String:
      return {
        type: ExplanationSchemaType.String
      };
    case SchemaType.Symbol:
      return {
        type: ExplanationSchemaType.Symbol
      };
    case SchemaType.Test:
      return {
        type: ExplanationSchemaType.Test,
        description: getTesterDescription(schema.tester)
      };
    case SchemaType.Variant:
      return {
        type: ExplanationSchemaType.Variant,
        variants: schema.variants.map(schemaToExplanationSchema)
      };
    case SchemaType.Custom:
      const { customValidator, description } = schema;
      let innerExplanations: any[] = [];
      if ("explanations" in customValidator) {
        const { explanations } = customValidator;
        if (Array.isArray(explanations)) {
          innerExplanations = explanations;
        }
      }
      return {
        type: ExplanationSchemaType.Custom,
        description:
          description == null
            ? getCustomValidatorDescription(customValidator)
            : description,
        innerExplanations
      };
  }
}
