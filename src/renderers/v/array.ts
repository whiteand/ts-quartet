import { ISchemaRenderer } from "../../types";
import { getSimpleCondition } from "./utils";

export const arrayRenderer: ISchemaRenderer<null> = getSimpleCondition(
  valueId => `Array.isArray(${valueId})`,
  valueId => `!Array.isArray(${valueId})`
);
