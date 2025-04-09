import { RawSchema } from "../../IRawSchema";
import { rawSchemaToSchema } from "../../rawSchemaToSchema";
import { CompilationResult, Z } from "../../types";
import { eCompileSchema } from "./eCompileSchema";

export function eCompiler<T = Z>(
  rawSchema: RawSchema
): CompilationResult<T, Z> {
  return eCompileSchema<T>(rawSchemaToSchema(rawSchema));
}
