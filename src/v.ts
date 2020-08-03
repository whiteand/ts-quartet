import { vCompiler } from "./compilers/vCompiler";
import { IQuartetInstance } from "./IQuartetInstance";
import { methods } from "./methods";

export const v: IQuartetInstance = Object.assign(vCompiler, methods);
