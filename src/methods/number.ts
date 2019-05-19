import { GetFromSettings, TypeGuardValidator } from "../types";

export const getNumberValidator: GetFromSettings<
  TypeGuardValidator<number>
> = () => (value: any): value is number => typeof value === "number";
