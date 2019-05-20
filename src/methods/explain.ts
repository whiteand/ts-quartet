import { compile } from "../compile";
import { GetFromSettings } from "../types";
import { ExplainMethod } from "./index";

export const getExplainMethod: GetFromSettings<ExplainMethod> = settings => {
  const explainMethod: ExplainMethod = (schema, explanation) => {
    const compiled = compile(settings, schema, explanation)
    return (value: any): any[] | null => {
      const explanations: any[] = []
      const isValid = compiled(value, explanations)
      return isValid
        ? null
        : explanations
    }
  }
  return explainMethod
}