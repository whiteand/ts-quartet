import { ISchemaRenderer } from "../../types";
import { getStrictComparisonWithSchemaRenderer } from "./utils";

export const symbolConstantRenderer: ISchemaRenderer<
  symbol
> = getStrictComparisonWithSchemaRenderer("validSymbol");
