import { RawSchema } from "./rawSchemaToSchema";
import { CompilationResult } from "./types";

export type Compiler<E = any> = <T = any>(
  rawSchema: RawSchema
) => CompilationResult<T, E>;
