import { IFunctionSchema } from "../types";
import { SchemaType } from "./SchemaType";

const FUNCTION_SCHEMA: IFunctionSchema = {
  type: SchemaType.Function
};

export function functionSchema(): IFunctionSchema {
  return FUNCTION_SCHEMA;
}
