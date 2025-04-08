import { RawSchema } from "../../IRawSchema";
import { rawSchemaToSchema } from "../../rawSchemaToSchema";
import { CompilationResult } from "../../types";
import { eCompileSchema } from "./eCompileSchema";

export function eCompiler<T = any>(
  rawSchema: RawSchema
): CompilationResult<T, any> {
  return eCompileSchema<T>(rawSchemaToSchema(rawSchema));
}
