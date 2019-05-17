import {
  Explanation,
  IKeyParentSchema,
  InstanceSettings,
  Schema
} from "./types";

export const doExplanations = (
  value: any,
  schema: Schema,
  settings: InstanceSettings,
  parents?: IKeyParentSchema[],
  explanation?: Explanation,
  explanations?: any[]
) => {
  const paramExplanation = explanation || settings.defaultExplanation;
  if (paramExplanation === undefined) {
    return;
  }
  if (!explanations) {
    return;
  }
  const getExplanation =
    typeof paramExplanation === "function" ? paramExplanation : () => paramExplanation;
  const actualExplanation = getExplanation(value, schema, settings, parents || []);
  if (explanations && actualExplanation !== undefined) {
    explanations.push(actualExplanation);
  }
};
