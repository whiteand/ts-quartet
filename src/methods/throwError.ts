import { GetFromSettings, Schema } from "../types";
import { compile } from "./../compile";
import { ThrowErrorMethod } from "./index";

export const getThrowErrorMethod: GetFromSettings<
  ThrowErrorMethod
> = settings => <T = any>(
  schema: Schema,
  errorMessage: string | ((value: any) => string)
) => {
  const compiled = compile(settings, schema);
  const getErrorMessage =
    typeof errorMessage === "function" ? errorMessage : () => errorMessage;
  return (value: any): T => {
    const explanations: any = [];
    if (!compiled(value, explanations)) {
      const error = new TypeError(getErrorMessage(value));
      throw Object.assign(error, { explanations, schema });
    }
    return value as T;
  };
};
