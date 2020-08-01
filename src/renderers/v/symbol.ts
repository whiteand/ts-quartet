import { ISchemaRenderer } from "../../types";
import { getSimpleCondition } from "./utils";

export const symbolRenderer: ISchemaRenderer<null> = getSimpleCondition(
  valueId => `typeof ${valueId} === 'symbol'`,
  valueId => `typeof ${valueId} !== 'symbol'`
);
