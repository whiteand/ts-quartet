import { ISchemaRenderer } from "../../types";
import { getSimpleCondition } from "./utils";

export const stringRenderer: ISchemaRenderer<null> = getSimpleCondition(
  valueId => `typeof ${valueId} === 'string'`,
  valueId => `typeof ${valueId} !== 'string'`
);
