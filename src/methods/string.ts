import { GetFromSettings, TypeGuardValidator } from "../types";

export const getStringValidator: GetFromSettings<
  TypeGuardValidator<string>
> = () => (value: any): value is string => typeof value === "string";
