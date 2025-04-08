import { ValidateBySchema } from "./infer";
import { RawSchema } from "./IRawSchema";
import { CompilationResult } from "./types";

export type Compiler<E = any> = <const R extends RawSchema>(
  rawSchema: R
) => CompilationResult<ValidateBySchema<R>, E>;
