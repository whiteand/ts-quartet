import { ConstantSchema } from "./types";

export function compileConstant(c: ConstantSchema) {
  const isValid = Number.isNaN(c as any)
    ? (value: any) => Number.isNaN(value)
    : (value: any) => value === c;
  return Object.assign(isValid, { explanations: [] });
}
