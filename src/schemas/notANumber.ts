import { INotANumberSchema } from "../types";
import { SchemaType } from "./SchemaType";

const NOT_A_NUMBER_SCHEMA: INotANumberSchema = {
  type: SchemaType.NotANumber
};
export function notANumber(): INotANumberSchema {
  return NOT_A_NUMBER_SCHEMA;
}
