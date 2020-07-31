import { ISchemaRenderer } from "../../types";
import { fromValueSchemaAlloc } from "./utils";

export const booleanConstantRenderer: ISchemaRenderer<
  boolean
> = fromValueSchemaAlloc(
  (valueId, schema) => {
    return schema ? `${valueId} === true` : `${valueId} === false`;
  },
  (valueId, schema) => {
    return schema ? `${valueId} !== true` : `${valueId} !== false`;
  }
);
