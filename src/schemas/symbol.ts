import { ISymbolSchema } from "../types";
import { SchemaType } from "./SchemaType";

const SYMBOL_SCHEMA: ISymbolSchema = {
  type: SchemaType.Symbol,
};

export function symbol(): ISymbolSchema {
  return SYMBOL_SCHEMA;
}
