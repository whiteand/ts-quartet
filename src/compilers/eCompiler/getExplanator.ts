import { IExplanation } from "../../explanations";

export function getExplanator(
  schema: TSchema
): (value: any) => null | IExplanation[] {
  return () => null;
}
