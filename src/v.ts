import { Compiler } from "./Compiler";
import { vCompiler } from "./compilers/vCompiler";
import { methods, VMethods } from "./methods";

export interface IQuartetInstance extends Compiler<any>, VMethods {}

export const v: IQuartetInstance = Object.assign(vCompiler, methods);
