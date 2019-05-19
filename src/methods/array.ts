import { GetFromSettings, TypeGuardValidator } from "../types";

export const getArrayValidator: GetFromSettings<
  TypeGuardValidator<any[]>
> = () => (value: any): value is any[] => Array.isArray(value);
