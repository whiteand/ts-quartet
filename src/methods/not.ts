import { compile } from "../compile";
import { ValidatorType } from "../constants";
import { doExplanations } from "../doExplanation";
import {
  Explanation,
  GetFromSettings,
  IKeyParentSchema,
  Schema
} from "../types";
import { NotMethod } from "./index";

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
        if (isValid) {
          doExplanations(
            value,
            schema,
            settings,
            parents,
            explanation,
            explanations
          );
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
