import { EnumMethod } from ".";
import { ValidatorType } from "../constants";
import { GetFromSettings } from "../types";

export const getEnumMethod: GetFromSettings<EnumMethod> = () => (...values) =>
  Object.assign((value: any) => values.includes(value), {
    schema: { type: ValidatorType.Enum, innerSchema: values }
  });
