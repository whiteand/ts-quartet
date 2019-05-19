import { GetFromSettings, TypeGuardValidator } from "../types";

export const getPositiveValidator: GetFromSettings<
  TypeGuardValidator<number>
> = () => (value: any): value is number =>
  typeof value === "number" && value > 0;

export const getNegativeValidator: GetFromSettings<
  TypeGuardValidator<number>
> = () => (value: any): value is number =>
  typeof value === "number" && value < 0;

export const getNonPositiveValidator: GetFromSettings<
  TypeGuardValidator<number>
> = () => (value: any): value is number =>
  typeof value === "number" && value <= 0;

export const getNonNegativeValidator: GetFromSettings<
  TypeGuardValidator<number>
> = () => (value: any): value is number =>
  typeof value === "number" && value >= 0;
