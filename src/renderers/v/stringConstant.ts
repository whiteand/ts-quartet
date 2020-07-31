import { ISchemaRenderer } from "../../types";
import { fromValueSchemaAlloc } from "./utils";

const MAX_LENGTH_STORED_IN_CONSTANT_LITERAL = 40;

export const stringConstantRenderer: ISchemaRenderer<
  string
> = fromValueSchemaAlloc(
  (valueId, schema, alloc) => {
    if (schema.length > MAX_LENGTH_STORED_IN_CONSTANT_LITERAL) {
      const stringVar = alloc(schema, "validString");
      return `${valueId} === ${stringVar}`;
    }
    return `${valueId} === ${JSON.stringify(schema)}`;
  },
  (valueId, schema, alloc) => {
    if (schema.length > MAX_LENGTH_STORED_IN_CONSTANT_LITERAL) {
      const stringVar = alloc(schema, "validString");
      return `${valueId} !== ${stringVar}`;
    }
    return `${valueId} !== ${JSON.stringify(schema)}`;
  }
);
