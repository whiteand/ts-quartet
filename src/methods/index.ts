import { QuartetInstance, Schema, TypeGuardValidator } from "../global";

export interface IMethods {
  array: TypeGuardValidator<any[]>;
  finite: TypeGuardValidator<number>;
  number: TypeGuardValidator<number>;
  safeInteger: TypeGuardValidator<number>;
  string: TypeGuardValidator<string>;
}
export const methods: IMethods = {
  array: (value): value is any[] => Array.isArray(value),
  finite: (value): value is number => Number.isFinite(value),
  number: (value): value is number => typeof value === "number",
  safeInteger: (value): value is number => Number.isSafeInteger(value),
  string: (value): value is string => typeof value === "string"
};
