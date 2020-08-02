import { RawSchema, rawSchemaToSchema } from "../rawSchemaToSchema";
import { Validator, CompilationResult, KeyType, TSchema } from "../types";
import { SchemaType } from "../schemas";
import { has } from "../utils";

function validate(value: any, schema: TSchema, path: KeyType[]): boolean {
  if (typeof schema !== "object" || schema === null) {
    return Number.isNaN(schema) ? Number.isNaN(value) : value === schema;
  }
  switch (schema.type) {
    case SchemaType.And:
      const { schemas } = schema;
      for (let i = 0; i < schemas.length; i++) {
        const andSchema = schemas[i];
        if (!validate(value, schema, path)) {
          return false;
        }
      }
      return true;
      break;
    case SchemaType.Any:
      return true;
    case SchemaType.Array:
      return Array.isArray(value);
    case SchemaType.ArrayOf:
      if (!Array.isArray(value)) return false;
      if (value.length <= 0) return true;
      const { elementSchema } = schema;
      for (let i = 0; i < value.length; i++) {
        const element = value[i];
        path.push(i);
        if (!validate(element, elementSchema, path)) {
          path.pop();
          return false;
        }
        path.pop();
      }
      return true;
    case SchemaType.Boolean:
      return typeof value === "boolean";
    case SchemaType.Finite:
      return Number.isFinite(value);
    case SchemaType.Function:
      return typeof value === "function";
    case SchemaType.Max:
      return schema.isExclusive
        ? value < schema.maxValue
        : value <= schema.maxValue;
    case SchemaType.MaxLength:
      if (value == null) return false;
      return schema.isExclusive
        ? value.length < schema.maxLength
        : value.length <= schema.maxLength;
    case SchemaType.Min:
      return schema.isExclusive
        ? value > schema.minValue
        : value >= schema.minValue;
    case SchemaType.MinLength:
      if (value == null) return false;
      return schema.isExclusive
        ? value.length > schema.minLength
        : value.length >= schema.minLength;
    case SchemaType.Negative:
      return value < 0;
    case SchemaType.Never:
      return false;
    case SchemaType.Not:
      return !validate(value, schema.schema, path);
    case SchemaType.Number:
      return typeof value === "number";
    case SchemaType.Object:
      if (value == null) return false;
      const { props, propsSchemas } = schema;
      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        const propValue = value[prop];
        path.push(prop);
        if (!validate(propValue, propsSchemas[prop as string], path)) {
          path.pop();
          return false;
        }
        path.pop();
      }
      if (schema.hasRestValidator) {
        const restProps = Object.keys(value).filter(
          (key) => !has(propsSchemas, key) && schema.restOmit.indexOf(key) < 0
        );
        for (let i = 0; i < restProps.length; i++) {
          const restProp = restProps[i];
          const restValue = value[restProp];
          path.push(restProp);
          if (!validate(restValue, schema.rest, path)) {
            path.pop();
            return false;
          }
          path.pop();
        }
      }
      return true;
      break;
    case SchemaType.Pair:
      const obj = {
        key: path[path.length - 1],
        value,
      };
      return validate(obj, schema.keyValueSchema, path);
    case SchemaType.Positive:
      return value > 0;
    case SchemaType.SafeInteger:
      return Number.isSafeInteger(value);
    case SchemaType.String:
      return typeof value === "string";
    case SchemaType.Symbol:
      return typeof value === "symbol";
    case SchemaType.Test:
      return Boolean(schema.tester.test(value));
    case SchemaType.Variant:
      const { variants } = schema;
      if (variants.length === 0) {
        return false;
      }
      for (let i = 0; i < variants.length; i++) {
        const variantSchema = variants[i];
        if (validate(value, variantSchema, path)) {
          return true;
        }
      }
      return false;
    case SchemaType.Custom:
      const { customValidator } = schema;
      return Boolean(customValidator(value));
  }
}

function vCompileSchema<T = any>(schema: TSchema): CompilationResult<T, any> {
  const explanations: any[] = [];
  const validator = ((value: any) => validate(value, schema, [])) as Validator<
    T
  >;
  return Object.assign(validator, { explanations });
}

export function vCompiler<T = any>(
  rawSchema: RawSchema
): CompilationResult<T, any> {
  const schema = rawSchemaToSchema(rawSchema);
  return vCompileSchema<T>(schema);
}
