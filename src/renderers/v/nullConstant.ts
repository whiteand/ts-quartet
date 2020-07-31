import { ISchemaRenderer } from "../../types";
import { fromValueSchemaAlloc } from "./utils";

export const nullConstantRenderer: ISchemaRenderer<null> = fromValueSchemaAlloc(
  valueId => `${valueId} === null`,
  valueId => `${valueId} !== null`
);
