import { RawSchema } from "./IRawSchema";
import { ValidateBySchema } from "./infer";
import { CompilationResult } from "./types";

export type Compiler<E = any> = <const R extends RawSchema>(
  rawSchema: R
) => CompilationResult<ValidateBySchema<R>, E>;
