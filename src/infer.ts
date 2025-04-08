import { IfAny } from "./IfAny";
import { SchemaType } from "./schemas";
import { TNumberString } from "./strnum";
import { CompilationResult, TPrimitiveSchema } from "./types";

type Z = any;

type Values<T> = T[keyof T];

export type FromRawSchema<R> = {
  __infer_from_raw_schema: R;
};

export type GetFromRawSchema<T> = T extends { __infer_from_raw_schema: infer R }
  ? R
  : unknown;

export type InferOr<T> = Values<
  { [K in Extract<keyof T, number>]: RawToT<T[K]> }
>;

export type UnionToIntersection<T> = (T extends any
  ? (param: T) => any
  : never) extends (param: infer TI) => any
  ? TI
  : never;

type AnyFunction = (...args: any[]) => any;

export type Intersect<A, B> = IfAny<A, B, Extract<A, B>>;

type InferAnd<T, Acc> = T extends readonly []
  ? never
  : T extends readonly [infer U]
  ? Intersect<Acc, RawToT<U>>
  : T extends readonly [infer U, ...infer R]
  ? InferAnd<R, Intersect<Acc, RawToT<U>>>
  : Z;

type OfT<T> = T extends T ? { readonly type: T } : never;

type TMinSchemaValue = number | TNumberString | bigint | null;

export type RawToT<R> = R extends TPrimitiveSchema
  ? R
  : R extends readonly [...infer T]
  ? InferOr<T>
  : R extends OfT<SchemaType.ArrayOf>
  ? Array<RawToT<GetFromRawSchema<R>>>
  : R extends OfT<SchemaType.Array>
  ? Z[]
  : R extends OfT<SchemaType.And>
  ? InferAnd<GetFromRawSchema<R>, Z>
  : R extends OfT<SchemaType.Any>
  ? Z
  : R extends OfT<SchemaType.Boolean>
  ? boolean
  : R extends OfT<SchemaType.Function>
  ? AnyFunction
  : R extends OfT<SchemaType.Max | SchemaType.Min | SchemaType.Negative>
  ? TMinSchemaValue
  : R extends OfT<SchemaType.MaxLength | SchemaType.MinLength>
  ? { length: TMinSchemaValue }
  : R extends OfT<
      | SchemaType.Number
      | SchemaType.NotANumber
      | SchemaType.Finite
      | SchemaType.SafeInteger
    >
  ? number
  : R extends OfT<SchemaType.String>
  ? string
  : R extends OfT<SchemaType.Never>
  ? never
  : R extends OfT<SchemaType.Not>
  ? Z
  : Z;
// TODO: IObjectSchema
// TODO: IPairSchema
// TODO: IPositiveSchema
// TODO: ISafeIntegerSchema
// TODO: IStringSchema
// TODO: ISymbolSchema
// TODO: ITestSchema
// TODO: IVariantSchema
// TODO: ICustomSchema;

export type InferValidatedByCompilationResult<F> = F extends CompilationResult<
  infer X,
  Z
>
  ? X
  : unknown;
