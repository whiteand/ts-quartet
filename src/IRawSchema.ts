import { SpecialProp } from "./schemas/SpecialProp";
import { CompilationResult, KeyType, TSchema } from "./types";

export interface IRawSchemaArr extends ReadonlyArray<RawSchema> {}
export interface IRawSchemaDict extends Readonly<Record<KeyType, RawSchema>> {}

export type RawSchema =
  | TSchema
  | CompilationResult
  | IRawSchemaArr
  | (IRawSchemaDict & {
      readonly [SpecialProp.Rest]?: RawSchema;
      readonly [SpecialProp.RestOmit]?: KeyType[];
    });
