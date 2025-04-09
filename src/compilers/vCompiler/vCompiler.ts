import { RawSchema } from "../../IRawSchema";
import { rawSchemaToSchema } from "../../rawSchemaToSchema";
import { CompilationResult, Z } from "../../types";
import { vCompileSchema } from "./vCompileSchema";

export function vCompiler<T = Z>(
  rawSchema: RawSchema,
): CompilationResult<T, Z> {
  return vCompileSchema<T>(rawSchemaToSchema(rawSchema));
}
