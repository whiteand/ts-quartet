import { IfAny } from "./IfAny";
import { RawSchema } from "./IRawSchema";
import { SchemaType } from "./schemas/SchemaType";

export interface IAndSchema {
  type: SchemaType.And;
  schemas: TSchema[];
}
export interface IAnySchema {
  type: SchemaType.Any;
}

export interface IArraySchema {
  type: SchemaType.Array;
}

export interface IArrayOfSchema {
  type: SchemaType.ArrayOf;
  elementSchema: TSchema;
}

export interface IBooleanSchema {
  type: SchemaType.Boolean;
}

export interface IFiniteSchema {
  type: SchemaType.Finite;
}

export interface IFunctionSchema {
  type: SchemaType.Function;
}
export interface IMaxSchema {
  type: SchemaType.Max;
  maxValue: number;
  isExclusive: boolean;
}

export interface IMaxLengthSchema {
  type: SchemaType.MaxLength;
  maxLength: number;
  isExclusive: boolean;
}
export interface IMinSchema {
  type: SchemaType.Min;
  minValue: number;
  isExclusive: boolean;
}

export interface IMinLengthSchema {
  type: SchemaType.MinLength;
  minLength: number;
  isExclusive: boolean;
}

export interface INegativeSchema {
  type: SchemaType.Negative;
}
export interface INeverSchema {
  type: SchemaType.Never;
}
export interface INotSchema {
  type: SchemaType.Not;
  schema: TSchema;
}

export interface INumberSchema {
  type: SchemaType.Number;
}

export interface INotANumberSchema {
  type: SchemaType.NotANumber;
}

export type KeyType = string | number;

export interface IObjectSchema {
  type: SchemaType.Object;
  propsSchemas: Record<KeyType, TSchema>;
  props: KeyType[];
  hasRestValidator: boolean;
  rest: TSchema;
  restOmitDict: Record<KeyType, boolean>;
}

export interface IPairSchema {
  type: SchemaType.Pair;
  keyValueSchema: TSchema;
}

export interface IPositiveSchema {
  type: SchemaType.Positive;
}

export interface ISafeIntegerSchema {
  type: SchemaType.SafeInteger;
}

export interface IStringSchema {
  type: SchemaType.String;
}

export interface ISymbolSchema {
  type: SchemaType.Symbol;
}

export interface ITester {
  test: (value: any) => boolean;
}

export interface ITestSchema {
  type: SchemaType.Test;
  tester: ITester;
}

export interface IVariantSchema {
  type: SchemaType.Variant;
  variants: TSchema[];
}

export type TCustomValidator = (
  value: any
) => boolean & { explanations?: any[] };

export interface ICustomSchema {
  type: SchemaType.Custom;
  description: string | undefined;
  customValidator: TCustomValidator;
}

export type TNonPrimitiveSchema =
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
  | IObjectSchema
  | IPairSchema
  | IPositiveSchema
  | ISafeIntegerSchema
  | IStringSchema
  | ISymbolSchema
  | ITestSchema
  | IVariantSchema
  | ICustomSchema;

export type TPrimitiveSchema =
  | null
  | undefined
  | boolean
  | symbol
  | string
  | number;

export type TSchema = TNonPrimitiveSchema | TPrimitiveSchema;

export interface ICompilationResultProps<Explanation> {
  explanations: Explanation[];
  [key: string]: any;
}

export type Validator<T = any> = IfAny<
  T,
  (value: any) => boolean,
  (value: any) => value is T
>;

export type CompilationResult<T = any, Explanation = any> = Validator<T> &
  ICompilationResultProps<Explanation>;
