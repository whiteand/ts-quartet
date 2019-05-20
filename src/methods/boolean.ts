import { GetFromSettings, TypeGuardValidator } from "../types";

export const getBooleanValidator: GetFromSettings<
  TypeGuardValidator<boolean>
> = () => (value: any): value is boolean => typeof value === "boolean";
