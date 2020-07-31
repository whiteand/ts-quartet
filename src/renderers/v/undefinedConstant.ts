import { ISchemaRenderer } from "../../types";
import { fromValueSchemaAlloc } from "./utils";

export const undefinedConstantRenderer: ISchemaRenderer<
  undefined
> = fromValueSchemaAlloc(
  valueId => `${valueId} === undefined`,
  valueId => `${valueId} !== undefined`
);
