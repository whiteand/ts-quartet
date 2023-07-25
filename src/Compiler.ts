import { Inf, RT, WR } from "./infer";
import { RawSchema } from "./IRawSchema";
import { CompilationResult } from "./types";

export interface Compiler<E = any> {
  <const R, W = WR<R>, S = RT<W>, T = Inf<S>>(
    rawSchema: R
  ): CompilationResult<T, E>;
  <T>(
    rawSchema: RawSchema
  ): CompilationResult<T, E>;
}

