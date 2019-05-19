import { GetFromSettings, TypeGuardValidator } from "../types";

export const getSafeIntegerValidator: GetFromSettings<
  TypeGuardValidator<number>
> = () => (value: any): value is number => Number.isSafeInteger(value);
