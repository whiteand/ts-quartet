import { rawSchemaToSchema } from "../../rawSchemaToSchema";
import { RawSchema } from "../../IRawSchema";
import { CompilationResult } from "../../types";
import { eCompileSchema } from "./eCompileSchema";

export function eCompiler<T = any>(
  rawSchema: RawSchema
): CompilationResult<T, any> {
  const schema = rawSchemaToSchema(rawSchema);
  return eCompileSchema<T>(schema);
}
