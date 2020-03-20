import { GetFromSettings, TypeGuardValidator } from "../types";

export const getFunctionValidator: GetFromSettings<
  // tslint:disable-next-line
  TypeGuardValidator<Function>
  // tslint:disable-next-line
> = () => (value: any): value is Function => typeof value === "function";
