import { rawSchemaToSchema } from "../../rawSchemaToSchema";
import { RawSchema } from "../../IRawSchema";
import { CompilationResult } from "../../types";
import { vCompileSchema } from "./vCompileSchema";

export function vCompiler<T = any>(
  rawSchema: RawSchema
): CompilationResult<T, any> {
  const schema = rawSchemaToSchema(rawSchema);
  return vCompileSchema<T>(schema);
}
