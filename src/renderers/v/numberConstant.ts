import { ISchemaRenderer } from "../../types";
import { getDispatchedRenderer } from "../utils";
import {
  getSimpleCondition,
  getStrictComparisonWithSchemaRenderer
} from "./utils";

const nanRenderer: ISchemaRenderer<number> = getSimpleCondition(
  valueId => `Number.isNaN(${valueId})`,
  valueId => `!Number.isNaN(${valueId})`
);

const simpleNumber: ISchemaRenderer<
  number
> = getStrictComparisonWithSchemaRenderer("validNumber");

export const numberConstantRenderer: ISchemaRenderer<
  number
> = getDispatchedRenderer((schema: number) =>
  Number.isNaN(schema) ? nanRenderer : simpleNumber
);
