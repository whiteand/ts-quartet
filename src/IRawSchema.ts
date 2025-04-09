import { SpecialProp } from "./schemas/SpecialProp";
import {
  CompilationResult,
  IAndSchema,
  IAnySchema,
  IArrayOfSchema,
  IArraySchema,
  IBooleanSchema,
  ICustomSchema,
  IFiniteSchema,
  IFunctionSchema,
  IMaxLengthSchema,
  IMaxSchema,
  IMinLengthSchema,
  IMinSchema,
  INegativeSchema,
  INeverSchema,
  INotANumberSchema,
  INotSchema,
  INumberSchema,
  IPairSchema,
  IPositiveSchema,
  ISafeIntegerSchema,
  IStringSchema,
  ISymbolSchema,
  ITestSchema,
  KeyType,
  TPrimitiveSchema,
} from "./types";

export interface IRawSchemaArr extends ReadonlyArray<RawSchema> {}
export interface IRawSchemaDict extends Readonly<Record<KeyType, RawSchema>> {}

export type RawSchema =
  | IAndSchema
  | IAnySchema
  | IArraySchema
  | IArrayOfSchema
  | IBooleanSchema
  | IFiniteSchema
  | IFunctionSchema
  | IMaxSchema
  | IMaxLengthSchema
  | IMinSchema
  | IMinLengthSchema
  | INegativeSchema
  | INeverSchema
  | INotSchema
  | INotANumberSchema
  | INumberSchema
  | IPairSchema
  | IPositiveSchema
  | ISafeIntegerSchema
  | IStringSchema
  | ISymbolSchema
  | ITestSchema
  | ICustomSchema
  | TPrimitiveSchema
  | CompilationResult
  | IRawSchemaArr
  | (IRawSchemaDict & {
      readonly [SpecialProp.Rest]?: RawSchema;
      readonly [SpecialProp.RestOmit]?: KeyType[];
    });
