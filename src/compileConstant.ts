import { ConstantSchema } from "./types";

export function compileConstant(c: ConstantSchema) {
  return Object.assign((value: any) => value === c, { explanations: [] });
}
