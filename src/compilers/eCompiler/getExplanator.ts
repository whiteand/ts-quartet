import { IExplanation } from "../../explanations";
import { getAlloc } from "../../getAlloc";
import { SchemaType } from "../../schemas/SchemaType";
import { TSchema, Z } from "../../types";
import { beautifyStatements } from "../beautifyStatements";
import { explanation } from "./explanation";
import { returnExplanations } from "./returnExplanations";

export function getExplanator(
  schema: TSchema
): (value: Z, path: KeyType[]) => null | IExplanation[] {
  if (typeof schema !== "object" || schema === null) {
    return (value, path) =>
      value === schema ? null : [explanation(value, path, schema)];
  }
  switch (schema.type) {
    case SchemaType.And:
    case SchemaType.ArrayOf:
    case SchemaType.Object: {
      const context: Record<string, Z> = {};
      const contextParamName = "ctx";
      const pathParamName = "path";
      const alloc = getAlloc(context, contextParamName);
      const statements = returnExplanations(
        schema,
        alloc,
        "value",
        pathParamName,
        []
      );
      const funcBody = `${beautifyStatements(statements).join(
        "\n"
      )}\n  return null`;

      const explanator = new Function(
        "value",
        contextParamName,
        pathParamName,
        funcBody
      ) as (value: Z, context: Z, path: KeyType[]) => null | IExplanation[];
      return (value: Z, path: KeyType[]) => explanator(value, context, path);
    }
    case SchemaType.Any:
      return () => null;
    case SchemaType.Array:
      return (value, path) =>
        Array.isArray(value) ? null : [explanation(value, path, schema)];
    case SchemaType.Boolean:
      return (value, path) =>
        typeof value === "boolean" ? null : [explanation(value, path, schema)];
    case SchemaType.Finite:
      return (value, path) =>
        Number.isFinite(value) ? null : [explanation(value, path, schema)];
    case SchemaType.Function:
      return (value, path) =>
        typeof value === "function" ? null : [explanation(value, path, schema)];
    case SchemaType.Max:
      return schema.isExclusive
        ? (value, path) =>
            value < schema.maxValue ? null : [explanation(value, path, schema)]
        : (value, path) =>
            value <= schema.maxValue
              ? null
              : [explanation(value, path, schema)];
    case SchemaType.MaxLength:
      return schema.isExclusive
        ? (value, path) =>
            value != null && value.length < schema.maxLength
              ? null
              : [explanation(value, path, schema)]
        : (value, path) =>
            value != null && value.length <= schema.maxLength
              ? null
              : [explanation(value, path, schema)];
    case SchemaType.Min:
      return schema.isExclusive
        ? (value, path) =>
            value > schema.minValue ? null : [explanation(value, path, schema)]
        : (value, path) =>
            value >= schema.minValue
              ? null
              : [explanation(value, path, schema)];
    case SchemaType.MinLength:
      return schema.isExclusive
        ? (value, path) =>
            value != null && value.length > schema.minLength
              ? null
              : [explanation(value, path, schema)]
        : (value, path) =>
            value != null && value.length >= schema.minLength
              ? null
              : [explanation(value, path, schema)];
    case SchemaType.Negative:
      return (value, path) =>
        value < 0 ? null : [explanation(value, path, schema)];

    case SchemaType.Never:
      return (value, path) => [explanation(value, path, schema)];
    case SchemaType.Not: {
      const oppositeExplanator = getExplanator(schema.schema);
      return (value, path) =>
        oppositeExplanator(value, path)
          ? null
          : [explanation(value, path, schema)];
    }
    case SchemaType.NotANumber:
      return (value, path) =>
        Number.isNaN(value) ? null : [explanation(value, path, schema)];
    case SchemaType.Number:
      return (value, path) =>
        typeof value === "number" ? null : [explanation(value, path, schema)];
    case SchemaType.Pair: {
      const pairValidationExplanator = getExplanator(schema.keyValueSchema);
      return (value, path) => {
        const pair = { value, key: path[path.length - 1] };
        return pairValidationExplanator(pair, path);
      };
    }
    case SchemaType.Positive:
      return (value, path) =>
        value > 0 ? null : [explanation(value, path, schema)];
    case SchemaType.SafeInteger:
      return (value, path) =>
        Number.isSafeInteger(value) ? null : [explanation(value, path, schema)];
    case SchemaType.String:
      return (value, path) =>
        typeof value === "string" ? null : [explanation(value, path, schema)];
    case SchemaType.Symbol:
      return (value, path) =>
        typeof value === "symbol" ? null : [explanation(value, path, schema)];
    case SchemaType.Test:
      return (value, path) =>
        schema.tester.test(value) ? null : [explanation(value, path, schema)];
    case SchemaType.Custom:
      return (value, path) => {
        const { customValidator } = schema;
        if (customValidator(value)) {
          return null;
        }
        return [explanation(value, path, schema)];
      };
    case SchemaType.Variant: {
      const explanators = schema.variants.map((variantSchema) =>
        getExplanator(variantSchema)
      );
      return (value, path) => {
        const innerExplanations: IExplanation[] = [];
        for (let i = 0; i < explanators.length; i++) {
          const explanator = explanators[i];
          const innerExps = explanator(value, path);
          if (!innerExps) {
            return null;
          }
          for (let j = 0; j < innerExps.length; j++) {
            innerExplanations.push(innerExps[j]);
          }
        }
        return [explanation(value, path, schema, innerExplanations)];
      };
    }
  }
}
