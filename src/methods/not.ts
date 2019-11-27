import { compile } from "../compile";
import {
  GetFromSettings,
  Schema,
  Explanation,
  IKeyParentSchema
} from "../types";
import { NotMethod } from "./index";
import { ValidatorType } from "../constants";

export const getNotMethod: GetFromSettings<NotMethod> = settings => {
  const notMethod = <T = any>(schema?: Schema, explanation?: Explanation) => {
    const compiled = compile(settings, schema, explanation);
    return Object.assign(
      (
        value: any,
        explanations?: Explanation[],
        parents: IKeyParentSchema[] = []
      ): value is T => {
        const isValid = compiled(value, [], parents);
        if (isValid && explanations && explanation) {
          explanations.push(explanation);
        }
        return !isValid;
      },
      {
        schema: { type: ValidatorType.Not, innerSchema: schema }
      }
    );
  };
  return notMethod;
};
