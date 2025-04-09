/* tslint:disable:object-literal-sort-keys */
import { IExplanation, schemaToExplanationSchema } from "../../explanations";
import { KeyType, TSchema, Z } from "../../types";
const EMPTY_PATH: KeyType[] = [];

export function explanation(
  value: Z,
  path: KeyType[],
  schema: TSchema,
  innerExplanations: IExplanation[] = []
): IExplanation {
  return {
    value,
    schema: schemaToExplanationSchema(schema),
    path: EMPTY_PATH.concat(path),
    innerExplanations,
  };
}
