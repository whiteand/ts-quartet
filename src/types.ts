import { IfAny } from "./IfAny";
import { SchemaType } from "./schemas/SchemaType";

export interface IAndSchema {
  readonly type: SchemaType.And;
  readonly schemas: readonly TSchema[];
}
export interface IAnySchema {
  readonly type: SchemaType.Any;
}

export interface IArraySchema {
  readonly type: SchemaType.Array;
}

export interface IArrayOfSchema {
  readonly type: SchemaType.ArrayOf;
  readonly elementSchema: TSchema;
}

export interface IBooleanSchema {
  readonly type: SchemaType.Boolean;
}

export interface IFiniteSchema {
  readonly type: SchemaType.Finite;
}

export interface IFunctionSchema {
  readonly type: SchemaType.Function;
}
export interface IMaxSchema {
  readonly type: SchemaType.Max;
  readonly maxValue: number;
  readonly isExclusive: boolean;
}

export interface IMaxLengthSchema {
  readonly type: SchemaType.MaxLength;
  readonly maxLength: number;
  readonly isExclusive: boolean;
}
export interface IMinSchema {
  readonly type: SchemaType.Min;
  readonly minValue: number;
  readonly isExclusive: boolean;
}

export interface IMinLengthSchema {
  readonly type: SchemaType.MinLength;
  readonly minLength: number;
  readonly isExclusive: boolean;
}

export interface INegativeSchema {
  readonly type: SchemaType.Negative;
}
export interface INeverSchema {
  readonly type: SchemaType.Never;
}
export interface INotSchema {
  readonly type: SchemaType.Not;
  readonly schema: TSchema;
}

export interface INumberSchema {
  readonly type: SchemaType.Number;
}

export interface INotANumberSchema {
  readonly type: SchemaType.NotANumber;
}

export type KeyType = string | number;

export interface IObjectSchema {
  readonly type: SchemaType.Object;
  readonly propsSchemas: Readonly<Record<KeyType, TSchema>>;
  readonly props: readonly KeyType[];
  readonly hasRestValidator: boolean;
  readonly rest: TSchema;
  readonly restOmitDict: Readonly<Record<KeyType, boolean>>;
}

export interface IPairSchema {
  readonly type: SchemaType.Pair;
  readonly keyValueSchema: TSchema;
}

export interface IPositiveSchema {
  readonly type: SchemaType.Positive;
}

export interface ISafeIntegerSchema {
  readonly type: SchemaType.SafeInteger;
}

export interface IStringSchema {
  readonly type: SchemaType.String;
}

export interface ISymbolSchema {
  readonly type: SchemaType.Symbol;
}

export interface ITester {
  readonly test: (value: Z) => boolean;
}

export interface ITestSchema {
  readonly type: SchemaType.Test;
  readonly tester: ITester;
}

export interface IVariantSchema {
  readonly type: SchemaType.Variant;
  readonly variants: readonly TSchema[];
}

export type TCustomValidator = (value: Z) => boolean & { explanations?: Z[] };

export interface ICustomSchema {
  readonly type: SchemaType.Custom;
  readonly description: string | undefined;
  readonly customValidator: TCustomValidator;
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
  [key: string]: Z;
}

export type Validator<T = Z> = IfAny<
  T,
  (value: Z) => boolean,
  (value: Z) => value is T
>;

export type CompilationResult<T = Z, Explanation = Z> = Validator<T> &
  ICompilationResultProps<Explanation> & {
    readonly schema: TSchema;
    cast<U>(): CompilationResult<U, Explanation>;
  };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Z = any;
