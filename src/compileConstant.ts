import { CompilationResult, ConstantSchema, QuartetInstance } from "./types";

export function compileConstant(
  v: QuartetInstance,
  c: ConstantSchema
): CompilationResult {
  const isValid = Number.isNaN(c as any)
    ? (value: any) => Number.isNaN(value)
    : (value: any) => value === c;
  return Object.assign(isValid, { explanations: [], pure: true });
}
