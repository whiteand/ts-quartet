import { ISchemaRenderer } from "../../types";
import { getSimpleCondition } from "./utils";

export const numberRenderer: ISchemaRenderer<null> = getSimpleCondition(
  valueId => `typeof ${valueId} === 'number'`,
  valueId => `typeof ${valueId} !== 'number'`
);
