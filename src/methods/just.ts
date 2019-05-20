import { compile } from "./../compile";
import { GetFromSettings, Schema } from "./../types";
import { JustMethod } from "./index";

export const getJustMethod: GetFromSettings<JustMethod> = settings => {
  const justMethod: JustMethod = <T = any>(schema?: Schema) => {
    const compiled = compile(settings, schema);
    return (value: any): value is T => compiled(value, undefined, []);
  };
  return justMethod;
};
