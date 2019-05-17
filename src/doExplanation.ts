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
    typeof explanation === "function" ? explanation : () => explanation;
  const actualExplanation = getExplanation(value, schema, parents);
  if (explanations && actualExplanation !== undefined) {
    explanations.push(actualExplanation);
  }
};
