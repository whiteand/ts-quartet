import { ISchemaRenderer } from "../../types";
import { getSimpleCondition } from "./utils";

export const functionRenderer: ISchemaRenderer<null> = getSimpleCondition(
  valueId => `typeof ${valueId} === 'function'`,
  valueId => `typeof ${valueId} !== 'function'`
);
