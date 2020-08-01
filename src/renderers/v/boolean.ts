import { ISchemaRenderer } from "../../types";
import { getSimpleCondition } from "./utils";

export const booleanRenderer: ISchemaRenderer<null> = getSimpleCondition(
  valueId => `typeof ${valueId} === 'boolean'`,
  valueId => `typeof ${valueId} !== 'boolean'`
);
