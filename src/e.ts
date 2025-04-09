import { eCompiler } from "./compilers/eCompiler";
import { IExplanation } from "./explanations/types";
import { IQuartetInstance } from "./IQuartetInstance";
import { methods } from "./methods";

export const e: IQuartetInstance<IExplanation> = Object.assign(
  eCompiler,
  methods,
);
