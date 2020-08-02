import { RawSchema, rawSchemaToSchema } from "../rawSchemaToSchema";
import { SchemaType } from "../schemas";
import {
  Alloc,
  CompilationResult,
  KeyType,
  TSchema,
  Validator
} from "../types";
import { arrToDict, getKeyAccessor, has } from "../utils";

function validate(value: any, schema: TSchema, path: KeyType[]): boolean {
  if (typeof schema !== 'object' || schema === null) {
    if (Number.isNaN(schema)) {
      return Number.isNaN(value)
    }
    return value === schema
  }
  switch (schema.type) {
    // TODO: write it
  }
  throw new Error('Not handled schema')
}

function vCompileSchema<T = any>(
  schema: TSchema
): CompilationResult<T, any> & Ctx {
  const explanations: any[] = []
  return Object.assign((value) => {}, { explanations })
}

export function vCompiler<T = any>(
  rawSchema: RawSchema
): CompilationResult<T, any> & Ctx {
  const schema = rawSchemaToSchema(rawSchema);
  return vCompileSchema<T>(schema);
}
