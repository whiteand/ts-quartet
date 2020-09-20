import { Validator, TSchema } from "../../types";
import { validate } from "./validate";
import { SchemaType } from "../../schemas/SchemaType";

export function getValidatorFromSchema(
  schema: TSchema
): (value: any) => boolean {
  if (typeof schema !== "object" || schema === null) {
    return (value: any) => value === schema;
  }
  switch (schema.type) {
    // And
    case SchemaType.Any:
      return () => true;
    case SchemaType.Array:
      return (value) => Array.isArray(value);
    // ArrayOf
    case SchemaType.Boolean:
      return (value) => typeof value === "boolean";
    case SchemaType.Finite:
      return (value) => Number.isFinite(value);
    case SchemaType.Function:
      return (value) => typeof value === "function";
    case SchemaType.Max:
      return schema.isExclusive
        ? (value) => value < schema.maxValue
        : (value) => value <= schema.maxValue;
    // MaxLength
    case SchemaType.Min:
      return schema.isExclusive
        ? (value) => value > schema.minValue
        : (value) => value >= schema.minValue;
    // MinLength
    // Negative
    case SchemaType.Never:
      return () => false;
    case SchemaType.Not:
      const isNotValid = getValidatorFromSchema(schema.schema);
      return (value) => !isNotValid(value);
    case SchemaType.NotANumber:
      return (value: any) => Number.isNaN(value);
    // Number
    // Object
    // Pair
    // Positive
    // SafeInteger
    // String
    // Symbol
    // Test
    // Variant
    // Custom
    default:
      return (value: any) => validate(value, schema, []);
  }
}
