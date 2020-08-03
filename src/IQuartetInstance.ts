import { Compiler } from "./Compiler";
import { IMethods } from "./methods";

export interface IQuartetInstance<Explanations>
  extends Compiler<Explanations>,
    IMethods {}
