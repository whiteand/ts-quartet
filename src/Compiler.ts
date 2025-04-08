import { RawSchema } from "./IRawSchema";
import { RawToT } from "./infer";
import { CompilationResult } from "./types";

export type Compiler<E = any> = <const R extends RawSchema>(
  rawSchema: R
) => CompilationResult<RawToT<R>, E>;
