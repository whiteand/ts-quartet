import { IExplanation, schemaToExplanationSchema } from "../explanations";
import { RawSchema, rawSchemaToSchema } from "../rawSchemaToSchema";
import { SchemaType } from "../schemas";
import { CompilationResult, KeyType, TSchema, Validator } from "../types";
import { has } from "../utils";

function explanation(
  value: any,
  path: KeyType[],
  schema: TSchema
): IExplanation {
  return {
    path: [...path],
    schema: schemaToExplanationSchema(schema),
    value
  };
}

function validate(
  value: any,
  schema: TSchema,
  path: KeyType[],
  explanations: IExplanation[]
): boolean {
  if (typeof schema !== "object" || schema === null) {
    if (value === schema) {
      return true;
    }
    explanations.push(explanation(value, path, schema));
    return false;
  }
  switch (schema.type) {
    case SchemaType.And:
      const { schemas } = schema;
      for (let i = 0; i < schemas.length; i++) {
        const andSchema = schemas[i];
        if (!validate(value, andSchema, path, explanations)) {
          return false;
        }
      }
      return true;
    case SchemaType.Any:
      return true;
    case SchemaType.Array:
      if (Array.isArray(value)) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.ArrayOf:
      if (!Array.isArray(value)) {
        explanations.push(explanation(value, path, schema));
        return false;
      }
      if (value.length <= 0) {
        return true;
      }
      const { elementSchema } = schema;
      for (let i = 0; i < value.length; i++) {
        const element = value[i];
        path.push(i);
        if (!validate(element, elementSchema, path, explanations)) {
          path.pop();
          return false;
        }
        path.pop();
      }
      return true;
    case SchemaType.Boolean:
      if (typeof value === "boolean") {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Finite:
      if (Number.isFinite(value)) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Function:
      if (typeof value === "function") {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Max:
      if (
        schema.isExclusive ? value < schema.maxValue : value <= schema.maxValue
      ) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.MaxLength:
      if (value == null) {
        explanations.push(explanation(value, path, schema));
        return false;
      }
      if (
        schema.isExclusive
          ? value.length < schema.maxLength
          : value.length <= schema.maxLength
      ) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Min:
      if (
        schema.isExclusive ? value > schema.minValue : value >= schema.minValue
      ) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.MinLength:
      if (value == null) {
        explanations.push(explanation(value, path, schema));
        return false;
      }
      if (
        schema.isExclusive
          ? value.length > schema.minLength
          : value.length >= schema.minLength
      ) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Negative:
      if (value < 0) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Never:
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Not:
      if (validate(value, schema.schema, path, [])) {
        explanations.push(explanation(value, path, schema));
        return false;
      }
      return true;
    case SchemaType.NotANumber:
      if (Number.isNaN(value)) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Number:
      if (typeof value === "number") {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Object:
      if (value == null) {
        explanations.push(explanation(value, path, schema));
        return false;
      }
      const { props, propsSchemas } = schema;
      for (let i = 0; i < props.length; i++) {
        const prop = props[i];
        const propValue = value[prop];
        path.push(prop);
        if (
          !validate(propValue, propsSchemas[prop as string], path, explanations)
        ) {
          path.pop();
          return false;
        }
        path.pop();
      }
      if (schema.hasRestValidator) {
        const { restOmitDict } = schema;
        const restProps = Object.keys(value);
        for (let i = 0; i < restProps.length; i++) {
          const restProp = restProps[i];
          if (has(propsSchemas, restProp) || restOmitDict[restProp] === true) {
            continue;
          }
          const restValue = value[restProp];
          path.push(restProp);
          if (!validate(restValue, schema.rest, path, explanations)) {
            path.pop();
            return false;
          }
          path.pop();
        }
      }
      return true;
    case SchemaType.Pair:
      return validate(
        {
          key: path[path.length - 1],
          value
        },
        schema.keyValueSchema,
        path,
        explanations
      );
    case SchemaType.Positive:
      if (value > 0) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.SafeInteger:
      if (Number.isSafeInteger(value)) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.String:
      if (typeof value === "string") {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Symbol:
      if (typeof value === "symbol") {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Test:
      if (schema.tester.test(value)) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
    case SchemaType.Variant:
      const innerExplanations: IExplanation[] = [];
      const { variants } = schema;
      for (let i = 0; i < variants.length; i++) {
        const variantSchema = variants[i];
        if (validate(value, variantSchema, path, innerExplanations)) {
          return true;
        }
      }
      explanations.push(...innerExplanations);
      return false;
    case SchemaType.Custom:
      const { customValidator } = schema;
      if (customValidator(value)) {
        return true;
      }
      explanations.push(explanation(value, path, schema));
      return false;
  }
}

function eCompileSchema<T = any>(schema: TSchema): CompilationResult<T, any> {
  const explanations: any[] = [];
  function validator(value: any) {
    ((validator as unknown) as CompilationResult<
      T,
      IExplanation
    >).explanations = [];

    return validate(
      value,
      schema,
      [],
      ((validator as unknown) as CompilationResult<T, IExplanation>)
        .explanations
    );
  }
  return Object.assign(validator as Validator<T>, { explanations });
}

export function eCompiler<T = any>(
  rawSchema: RawSchema
): CompilationResult<T, any> {
  const schema = rawSchemaToSchema(rawSchema);
  return eCompileSchema<T>(schema);
}
