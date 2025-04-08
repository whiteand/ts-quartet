import { RawSchema } from "../../IRawSchema";
import { rawSchemaToSchema } from "../../rawSchemaToSchema";
import { CompilationResult } from "../../types";
import { vCompileSchema } from "./vCompileSchema";

export function vCompiler<T = any>(
  rawSchema: RawSchema
): CompilationResult<T, any> {
  return vCompileSchema<T>(rawSchemaToSchema(rawSchema));
}
