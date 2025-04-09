import { IfAny } from "./IfAny";
import { SchemaType, SpecialProp } from "./schemas";
import { TNumberString } from "./strnum";
import { CompilationResult, TPrimitiveSchema, Z } from "./types";
import { KeyType } from "./types";

type Values<T> = T[keyof T];

export interface IFromRawSchema<R> {
  __infer_from_raw_schema: R;
}

export type GetFromRawSchema<T> = T extends { __infer_from_raw_schema: infer R }
  ? R
  : unknown;

export type InferOr<T> = Values<
  { [K in Extract<keyof T, number>]: ValidateBySchema<T[K]> }
>;

export type UnionToIntersection<T> = (T extends Z
  ? (param: T) => Z
  : never) extends (param: infer TI) => Z
  ? TI
  : never;

type AnyFunction = (...args: Z[]) => Z;

export type Intersect<A, B> = IfAny<A, B, Extract<A, B>>;

type InferAnd<T, Acc> = T extends readonly []
  ? never
  : T extends readonly [infer U]
  ? Intersect<Acc, ValidateBySchema<U>> | Intersect<ValidateBySchema<U>, Acc>
  : T extends readonly [infer U, ...infer R]
  ? InferAnd<
      R,
      Intersect<Acc, ValidateBySchema<U>> | Intersect<ValidateBySchema<U>, Acc>
    >
  : Z;

type OfT<T> = T extends T ? { readonly type: T } : never;

type TMinSchemaValue = number | TNumberString | bigint | null;

/// It is not strictly right, but it is almost impossible for a person to use regexps not for strings
type InferTester<T> = T extends RegExp ? string : Z;

type InferCustom<T> = T extends (value: Z) => value is infer X ? X : Z;

type TToT<R> = R extends OfT<SchemaType.ArrayOf>
  ? ValidateBySchema<GetFromRawSchema<R>>[]
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
  : R extends OfT<
      | SchemaType.Max
      | SchemaType.Min
      | SchemaType.Negative
      | SchemaType.Positive
    >
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
  : R extends OfT<SchemaType.Symbol>
  ? symbol
  : R extends OfT<SchemaType.Never>
  ? never
  : R extends OfT<SchemaType.Not>
  ? Z
  : R extends OfT<SchemaType.Test>
  ? InferTester<GetFromRawSchema<R>>
  : R extends OfT<SchemaType.Custom>
  ? InferCustom<GetFromRawSchema<R>>
  : Z;
// TODO: IPairSchema;

type InferRestRestOmit<T, Rest, RestOmit> = InferRestless<T> &
  Record<Extract<KeyType, Values<RestOmit>>, ValidateBySchema<Rest>>;

type InferRest<T, Rest> = InferRestless<T> &
  Record<KeyType, ValidateBySchema<Rest>>;

type RestWithOmit = typeof SpecialProp.Rest | typeof SpecialProp.RestOmit;

type InferRestless<R> = { -readonly [K in keyof R]: ValidateBySchema<R[K]> };
type InferObj<R> = R extends {
  [SpecialProp.Rest]: infer Rest;
  [SpecialProp.RestOmit]: infer RestOmit;
}
  ? InferRestRestOmit<Omit<R, RestWithOmit>, Rest, RestOmit>
  : R extends {
      [SpecialProp.RestOmit]: Z;
    }
  ? InferRestless<Omit<R, RestWithOmit>>
  : R extends {
      [SpecialProp.Rest]: infer Rest;
    }
  ? InferRest<Omit<R, RestWithOmit>, Rest>
  : InferRestless<R>;

export type ValidateBySchema<R> = R extends TPrimitiveSchema
  ? R
  : R extends readonly [...infer T]
  ? InferOr<T>
  : R extends OfT<SchemaType>
  ? TToT<R>
  : R extends CompilationResult<infer X>
  ? X
  : InferObj<R>;

export type ValidatedBy<F> = F extends CompilationResult<infer X, Z> ? X : Z;
