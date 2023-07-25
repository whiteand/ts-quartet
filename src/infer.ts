import { SchemaType } from "./schemas/SchemaType";
import { TPrimitiveSchema } from "./types";

const value = Symbol.for("a");

type A = RT<never[]>;

/*export function rawSchemaToSchema(rawSchema: RawSchema): TSchema {
  if (
    has(rawSchema, "type") &&
    schemaTypeDict[rawSchema.type as SchemaType] === true
  ) {
    return rawSchema as TSchema;
  }
  if (has(rawSchema, SpecialProp.Rest)) {
    if (has(rawSchema, SpecialProp.RestOmit)) {
      const {
        [SpecialProp.Rest]: rawRest,
        [SpecialProp.RestOmit]: restOmit,
        ...rawPropsSchemas
      } = rawSchema as any;
      const restSchema = rawSchemaToSchema(rawRest);
      const propsSchemas = rawPropsSchemasToPropsSchemas(
        rawPropsSchemas as Record<KeyType, RawSchema>
      );
      return objectSchemaWithRest(
        propsSchemas,
        restSchema,
        arrToDict(restOmit)
      );
    }
    const {
      [SpecialProp.Rest]: rawRest,
      ...rawPropsSchemas
    } = rawSchema as any;
    const restSchema = rawSchemaToSchema(rawRest);
    const propsSchemas = rawPropsSchemasToPropsSchemas(
      rawPropsSchemas as Record<KeyType, RawSchema>
    );
    return objectSchemaWithRest(propsSchemas, restSchema, EMPTY_OBJ);
  }
  if (has(rawSchema, SpecialProp.RestOmit)) {
    const {
      [SpecialProp.RestOmit]: restOmit,
      ...rawPropsSchemas
    } = rawSchema as any;
    const propsSchemas = rawPropsSchemasToPropsSchemas(
      rawPropsSchemas as Record<KeyType, RawSchema>
    );
    return objectSchemaWithoutRest(propsSchemas);
  }
  const propsSchemas = rawPropsSchemasToPropsSchemas(rawSchema as Record<
    KeyType,
    RawSchema
  >);
  return objectSchemaWithoutRest(propsSchemas);
}
*/

export type WR<T> = T extends TPrimitiveSchema
  ? T
  : T extends readonly []
  ? []
  : T extends readonly never[]
  ? never[]
  : T extends readonly [infer A]
  ? [WR<A>]
  : T extends readonly [infer A, ...infer Rest]
  ? [WR<A>, ...WR<Rest>]
  : T extends readonly (infer A)[]
  ? WR<A>[]
  : { -readonly [k in keyof T]: WR<T[k]> };

type Variants<A, B> = A extends (never | [] | never[])
  ? B
  : B extends (never | [] | never[])
  ? A
  : A extends any[]
  ? B extends any[]
    ? [...A, ...B]
    : [...A, B]
  : B extends any[]
  ? [A, ...B]
  : [A, B];

export type RT<R> = R extends TPrimitiveSchema
  ? R
  : R extends ([] | never[])
  ? never
  : R extends [infer X]
  ? RT<X>
  : R extends [infer X, ...infer Rest]
  ? {
      type: SchemaType.Variant;
      variants: Variants<RT<X>, RT<Rest>>;
    }
  : R extends { type: SchemaType }
  ? R
  : "not inferred in RT";

export type ExpandVariants<VS> = VS extends [infer T]
  ? Inf<T>
  : VS extends [infer T, ...infer Rest]
  ? Inf<T> | ExpandVariants<Rest>
  : "not inferrred in ExpandVariants";
export type ExpandAnd<VS> = VS extends [infer T]
  ? Inf<T>
  : VS extends [infer T, ...infer Rest]
  ? Inf<T> & ExpandVariants<Rest>
  : VS;

/**
Not
NotANumber
Number
Object
Pair
Positive
SafeInteger
Symbol
Test
Variant
Custom
 */

type AnyFunction = (...args: any[]) => any;

type NumberSchemaTypes = SchemaType.Number | SchemaType.NotANumber | SchemaType.SafeInteger | SchemaType.Finite | SchemaType.Max | SchemaType.Min | SchemaType.Positive | SchemaType.Negative;

export type Inf<T> = T extends TPrimitiveSchema
  ? T
  : T extends { type: SchemaType.Variant; variants: infer VS }
  ? ExpandVariants<VS>
  : T extends { type: SchemaType.String }
  ? string
  : T extends { type: NumberSchemaTypes }
  ? number
  : T extends { type: SchemaType.Boolean }
  ? boolean
  : T extends { type: SchemaType.Function }
  ? AnyFunction
  : T extends { type: SchemaType.MaxLength }
  ? { length: number }
  : T extends { type: SchemaType.MinLength }
  ? { length: number }
  : T extends { type: SchemaType.Any }
  ? any
  : T extends { type: SchemaType.And; schemas: infer Schemas }
  ? ExpandAnd<Schemas>
  : T extends { type: SchemaType.Array }
  ? any[] 
  : T extends { type: SchemaType.Never }
  ? never 
  : T extends { type: SchemaType.ArrayOf; elementSchema: infer X }
  ? Inf<X>[]
  : T extends { type: infer X } ? X extends string  ?`not inferrred in Inf: ${X}` : 'not inferred in Inf': 'not inferred in Inf';

export type RTA<A> = A extends readonly []
  ? []
  : A extends readonly [infer X]
  ? [RT<X>]
  : A extends readonly [infer X, ...infer Rest]
  ? RTA<Rest> extends any[]
    ? [RT<X>, ...RTA<Rest>]
    : "not inferred in RTA 1"
  : "not inferred in RTA 2";

export type InferValidationType<R> = Inf<RT<WR<R>>>;
