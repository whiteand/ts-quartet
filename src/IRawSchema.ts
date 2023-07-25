import { SpecialProp } from "./schemas/SpecialProp";
import { KeyType, TSchema } from "./types";

export type RawSchema =
  | TSchema
  | RawSchema[]
  | {
      [key: string]: RawSchema;
      [SpecialProp.Rest]?: RawSchema;
      [SpecialProp.RestOmit]?: KeyType[];
    };
