import { KeyType, TPrimitiveSchema } from "../types";

export enum ExplanationSchemaType {
  And = "And",
  Any = "Any",
  Array = "Array",
  ArrayOf = "ArrayOf",
  Boolean = "Boolean",
  Finite = "Finite",
  Function = "Function",
  Max = "Max",
  MaxLength = "MaxLength",
  Min = "Min",
  MinLength = "MinLength",
  Negative = "Negative",
  Never = "Never",
  Not = "Not",
  NotANumber = "NotANumber",
  Number = "Number",
  Object = "Object",
  Pair = "Pair",
  Positive = "Positive",
  SafeInteger = "SafeInteger",
  String = "String",
  Symbol = "Symbol",
  Test = "Test",
  Variant = "Variant",
  Custom = "Custom"
}

export interface IAndExplanationSchema {
  type: ExplanationSchemaType.And;
  schemas: TExplanationSchema[];
}
export interface IAnyExplanationSchema {
  type: ExplanationSchemaType.Any;
}

export interface IArrayExplanationSchema {
  type: ExplanationSchemaType.Array;
}

export interface IArrayOfExplanationSchema {
  type: ExplanationSchemaType.ArrayOf;
  elementSchema: TExplanationSchema;
}

export interface IBooleanExplanationSchema {
  type: ExplanationSchemaType.Boolean;
}

export interface IFiniteExplanationSchema {
  type: ExplanationSchemaType.Finite;
}

export interface IFunctionExplanationSchema {
  type: ExplanationSchemaType.Function;
}
export interface IMaxExplanationSchema {
  type: ExplanationSchemaType.Max;
  maxValue: number;
  isExclusive: boolean;
}

export interface IMaxLengthExplanationSchema {
  type: ExplanationSchemaType.MaxLength;
  maxLength: number;
  isExclusive: boolean;
}
export interface IMinExplanationSchema {
  type: ExplanationSchemaType.Min;
  minValue: number;
  isExclusive: boolean;
}

export interface IMinLengthExplanationSchema {
  type: ExplanationSchemaType.MinLength;
  minLength: number;
  isExclusive: boolean;
}

export interface INegativeExplanationSchema {
  type: ExplanationSchemaType.Negative;
}
export interface INeverExplanationSchema {
  type: ExplanationSchemaType.Never;
}
export interface INotExplanationSchema {
  type: ExplanationSchemaType.Not;
  schema: TExplanationSchema;
}

export interface INumberExplanationSchema {
  type: ExplanationSchemaType.Number;
}

export interface INotANumberExplanationSchema {
  type: ExplanationSchemaType.NotANumber;
}

export interface IObjectExplanationSchemaWithoutRest {
  type: ExplanationSchemaType.Object;
  propsSchemas: {
    [key: string]: TExplanationSchema;
  };
}

export interface IObjectExplanationSchemaWithRest {
  type: ExplanationSchemaType.Object;
  propsSchemas: {
    [key: string]: TExplanationSchema;
  };
  "[v.rest]": TExplanationSchema;
  "[v.restOmit]"?: KeyType[];
}

export type TObjectExplanationSchema =
  | IObjectExplanationSchemaWithoutRest
  | IObjectExplanationSchemaWithRest;

export interface IPairExplanationSchema {
  type: ExplanationSchemaType.Pair;
  keyValueSchema: TExplanationSchema;
}

export interface IPositiveExplanationSchema {
  type: ExplanationSchemaType.Positive;
}

export interface ISafeIntegerExplanationSchema {
  type: ExplanationSchemaType.SafeInteger;
}

export interface IStringExplanationSchema {
  type: ExplanationSchemaType.String;
}

export interface ISymbolExplanationSchema {
  type: ExplanationSchemaType.Symbol;
}

export interface ITestExplanationSchema {
  type: ExplanationSchemaType.Test;
  description: string;
}

export interface IVariantExplanationSchema {
  type: ExplanationSchemaType.Variant;
  variants: TExplanationSchema[];
}

export interface ICustomExplanationSchema {
  type: ExplanationSchemaType.Custom;
  description: string;
  innerExplanations: any[];
}

export type TExplanationSchema =
  | TPrimitiveSchema
  | IAndExplanationSchema
  | IAnyExplanationSchema
  | IArrayExplanationSchema
  | IArrayOfExplanationSchema
  | IBooleanExplanationSchema
  | IFiniteExplanationSchema
  | IFunctionExplanationSchema
  | IMaxExplanationSchema
  | IMaxLengthExplanationSchema
  | IMinExplanationSchema
  | IMinLengthExplanationSchema
  | INegativeExplanationSchema
  | INeverExplanationSchema
  | INotExplanationSchema
  | INumberExplanationSchema
  | INotANumberExplanationSchema
  | TObjectExplanationSchema
  | IPairExplanationSchema
  | IPositiveExplanationSchema
  | ISafeIntegerExplanationSchema
  | IStringExplanationSchema
  | ISymbolExplanationSchema
  | ITestExplanationSchema
  | IVariantExplanationSchema
  | ICustomExplanationSchema;

export interface IExplanation {
  value: any;
  path: KeyType[];
  schema: TExplanationSchema;
  innerExplanations: IExplanation[];
}
