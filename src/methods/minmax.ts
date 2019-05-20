import { GetFromSettings, TypeGuardValidator } from "../types";
import { ValidatorType } from "./constants";
import { MaxMethod, MinMethod } from "./index";

export const getMinMethod: GetFromSettings<MinMethod> = () => (
  minValue: number,
  exclusive: boolean = false
) => {
  const minValidator: TypeGuardValidator<string | number | any[]> = (
    value: any
  ): value is string | number | any[] => {
    if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      !Array.isArray(value)
    ) {
      return false;
    }
    const actualValue = typeof value === "number" ? value : value.length;
    return exclusive ? value > minValue : value >= minValue;
  };
  return Object.assign(minValidator, {
    schema: { type: ValidatorType.Min, innerSchema: { minValue, exclusive } }
  });
};

export const getMaxMethod: GetFromSettings<MaxMethod> = () => (
  maxValue: number,
  exclusive: boolean = false
) => {
  const maxValidator: TypeGuardValidator<string | number | any[]> = (
    value: any
  ): value is string | number | any[] => {
    if (
      typeof value !== "string" &&
      typeof value !== "number" &&
      !Array.isArray(value)
    ) {
      return false;
    }
    const actualValue = typeof value === "number" ? value : value.length;
    return exclusive ? value < maxValue : value <= maxValue;
  };
  return Object.assign(maxValidator, {
    schema: { type: ValidatorType.Max, innerSchema: { maxValue, exclusive } }
  });
};
