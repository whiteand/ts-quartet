import { SpecialProp } from "./schemas/SpecialProp";
import { KeyType, TSchema } from "./types";

export interface IRawSchemaArr extends ReadonlyArray<RawSchema> {}
export interface IRawSchemaDict extends Readonly<Record<KeyType, RawSchema>> {}

export type RawSchema =
  | TSchema
  | IRawSchemaArr
  | (IRawSchemaDict & {
      readonly [SpecialProp.Rest]?: RawSchema;
      readonly [SpecialProp.RestOmit]?: KeyType[];
    });
