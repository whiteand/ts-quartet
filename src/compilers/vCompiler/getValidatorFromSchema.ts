import { getAlloc } from "../../getAlloc";
import { SchemaType } from "../../schemas/SchemaType";
import { TSchema, Z } from "../../types";
import { beautifyStatements } from "../beautifyStatements";
import { ifInvalidReturnFalse } from "./ifInvalidReturnFalse";

export function getValidatorFromSchema(
  schema: TSchema,
  key: string | number | undefined,
): (value: Z) => boolean {
  if (typeof schema !== "object" || schema === null) {
    return (value: Z) => value === schema;
  }
  switch (schema.type) {
    case SchemaType.And:
    case SchemaType.Object:
    case SchemaType.ArrayOf: {
      const context: Record<string, Z> = {};
      const contextParamName = "ctx";
      const alloc = getAlloc(context, contextParamName);
      const funcBody = `${beautifyStatements([
        ifInvalidReturnFalse(schema, alloc, "value", key),
      ]).join("\n")}\n  return true`;
      const isValid = new Function("value", contextParamName, funcBody) as (
        value: Z,
        context: Z,
      ) => boolean;
      return (value) => isValid(value, context);
    }
    case SchemaType.Any:
      return () => true;
    case SchemaType.Array:
      return (value) => Array.isArray(value);
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
    case SchemaType.MaxLength:
      return schema.isExclusive
        ? (value) => value != null && value.length < schema.maxLength
        : (value) => value != null && value.length <= schema.maxLength;
    case SchemaType.Min:
      return schema.isExclusive
        ? (value) => value > schema.minValue
        : (value) => value >= schema.minValue;
    case SchemaType.MinLength:
      return schema.isExclusive
        ? (value) => value != null && value.length > schema.minLength
        : (value) => value != null && value.length >= schema.minLength;
    case SchemaType.Negative:
      return (value) => value < 0;
    case SchemaType.Never:
      return () => false;
    case SchemaType.Not: {
      const isNotValid = getValidatorFromSchema(schema.schema, key);
      return (value) => !isNotValid(value);
    }
    case SchemaType.NotANumber:
      return (value) => Number.isNaN(value);
    case SchemaType.Number:
      return (value) => typeof value === "number";
    case SchemaType.Pair: {
      const isValidPair = getValidatorFromSchema(schema.keyValueSchema, key);
      const pair = {
        value: undefined,
        key,
      };
      return (value) => {
        pair.value = value;
        return isValidPair(pair);
      };
    }
    case SchemaType.Positive:
      return (value) => value > 0;
    case SchemaType.SafeInteger:
      return (value) => Number.isSafeInteger(value);
    case SchemaType.String:
      return (value) => typeof value === "string";
    case SchemaType.Symbol:
      return (value) => typeof value === "symbol";
    case SchemaType.Test:
      return (value) => schema.tester.test(value);
    case SchemaType.Custom:
      return schema.customValidator;
    case SchemaType.Variant: {
      const { variants } = schema;
      const compiledVariants = variants.map((innerSchema) =>
        getValidatorFromSchema(innerSchema, key),
      );
      return (value) => {
        for (let i = 0; i < compiledVariants.length; i++) {
          const compiledVariant = compiledVariants[i];
          if (compiledVariant(value)) {
            return true;
          }
        }
        return false;
      };
    }
  }
}
