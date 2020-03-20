import { GetFromSettings, TypeGuardValidator } from "../types";

export const getFunctionValidator: GetFromSettings<
  TypeGuardValidator<Function>
> = () => (value: any): value is Function => typeof value === "function";
