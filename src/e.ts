import { eCompiler } from "./compilers/eCompiler";
import { IQuartetInstance } from "./IQuartetInstance";
import { methods } from "./methods";

export const e: IQuartetInstance = Object.assign(eCompiler, methods);
