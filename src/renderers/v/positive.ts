import { ISchemaRenderer } from "../../types";
import { getSimpleCondition } from "./utils";

export const positiveRenderer: ISchemaRenderer<null> = getSimpleCondition(
  valueId => `${valueId} > 0`,
  valueId => `!(${valueId} > 0)`
);
