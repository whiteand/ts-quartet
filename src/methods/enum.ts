import { EnumMethod } from ".";
import { GetFromSettings } from "../types";
import { ValidatorType } from "./constants";

export const getEnumMethod: GetFromSettings<EnumMethod> = () => (...values) =>
  Object.assign((value: any) => values.includes(value), {
    schema: { type: ValidatorType.Enum, innerSchema: values }
  });
