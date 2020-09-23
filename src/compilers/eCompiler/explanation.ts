/* tslint:disable:object-literal-sort-keys */
import { IExplanation, schemaToExplanationSchema } from "../../explanations";
import { KeyType, TSchema } from "../../types";

export function explanation(
  value: any,
  path: KeyType[],
  schema: TSchema,
  innerExplanations: IExplanation[] = []
): IExplanation {
  return {
    value,
    schema: schemaToExplanationSchema(schema),
    path: [...path],
    innerExplanations
  };
}
