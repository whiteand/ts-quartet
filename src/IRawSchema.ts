import { SpecialProp } from "./schemas/SpecialProp";
import { KeyType, TSchema } from "./types";

export interface IRawSchemaArr extends Array<RawSchema> {}
export interface IRawSchemaDict extends Record<KeyType, RawSchema> {}

export type RawSchema =
  | TSchema
  | IRawSchemaArr
  | (IRawSchemaDict & {
      [SpecialProp.Rest]?: RawSchema;
      [SpecialProp.RestOmit]?: KeyType[];
    });
