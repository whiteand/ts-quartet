import { vCompiler } from "./compilers/vCompiler";
import { IQuartetInstance } from "./IQuartetInstance";
import { methods } from "./methods";
import { Z } from "./types";

export const v: IQuartetInstance<Z> = Object.assign(vCompiler, methods);
