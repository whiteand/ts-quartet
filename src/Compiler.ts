import { ValidateBySchema } from "./infer";
import { RawSchema } from "./IRawSchema";
import { CompilationResult, Z } from "./types";

export type Compiler<E = Z> = <const R extends RawSchema>(
  rawSchema: R,
) => CompilationResult<ValidateBySchema<R>, E>;
