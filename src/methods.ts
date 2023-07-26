import { RawSchema } from "./IRawSchema";
import { RT, RTA, WR } from "./infer";
import { rawSchemaToSchema } from "./rawSchemaToSchema";
import {
  SchemaType,
  SpecialProp,
  and,
  anySchema,
  array,
  arrayOf,
  boolean,
  custom,
  finite,
  functionSchema,
  max,
  maxLength,
  min,
  minLength,
  negative,
  neverSchema,
  not,
  number,
  pair,
  positive,
  safeInteger,
  string,
  symbol,
  testSchema,
} from "./schemas";
import { ITester, TCustomValidator } from "./types";

export const methods = {
  and(...rawSchemas: RawSchema[]) {
    return and(rawSchemas.map(rawSchemaToSchema));
  },
  any: anySchema(),
  array: array(),
  arrayOf<const S extends RawSchema>(rawElementSchema: S): { type: SchemaType.ArrayOf, elementSchema: RT<WR<S>> } {
    const elementSchema = rawSchemaToSchema(rawElementSchema);
    return arrayOf(elementSchema) as { type: SchemaType.ArrayOf, elementSchema: RT<WR<S>> };
  },
  boolean: boolean(),
  finite: finite(),
  function: functionSchema(),
  max(maxValue: number, isExclusive: boolean = false) {
    return max(maxValue, isExclusive);
  },
  maxLength(maxLengthValue: number, isExclusive: boolean = false) {
    return maxLength(maxLengthValue, isExclusive);
  },
  min(minValue: number, isExclusive: boolean = false) {
    return min(minValue, isExclusive);
  },
  minLength(minLengthValue: number, isExclusive: boolean = false) {
    return minLength(minLengthValue, isExclusive);
  },
  negative: negative(),
  never: neverSchema(),
  not(rawSchema: RawSchema) {
    const schema = rawSchemaToSchema(rawSchema);
    return not(schema);
  },
  number: number(),
  pair<const S extends RawSchema>(rawKeyValueSchema: S): { type: SchemaType.Pair, keyValueSchema: RT<WR<S>>} {
    const keyValueSchema = rawSchemaToSchema(rawKeyValueSchema);
    return pair(keyValueSchema) as { type: SchemaType.Pair, keyValueSchema: RT<WR<S>>};
  },
  positive: positive(),
  rest: SpecialProp.Rest as SpecialProp.Rest,
  restOmit: SpecialProp.RestOmit as SpecialProp.RestOmit,
  safeInteger: safeInteger(),
  string: string(),
  symbol: symbol(),
  test(tester: ITester) {
    return testSchema(tester);
  },
  custom(customValidator: TCustomValidator, description?: string) {
    return custom(customValidator, description);
  },
};

interface IAndMethod {
  and(): { type: SchemaType.And; schemas: [] };
  and<const R1 extends RawSchema>(r: R1): { type: SchemaType.And; schemas: [RT<WR<R1>>] };
  and<const R1 extends RawSchema,const R2 extends RawSchema>(r: R1, r2: R2): { type: SchemaType.And; schemas: [RT<WR<R1>>,RT<WR<R2>>] };
  and<const R1 extends RawSchema,const R2 extends RawSchema,const R3 extends RawSchema>(r: R1, r2: R2, r3: R3): { type: SchemaType.And; schemas: [RT<WR<R1>>,RT<WR<R2>>,RT<WR<R3>>] };
  and<const R1 extends RawSchema,const R2 extends RawSchema,const R3 extends RawSchema,const R4 extends RawSchema>(r: R1, r2: R2, r3: R3, r4: R4): { type: SchemaType.And; schemas: [RT<WR<R1>>,RT<WR<R2>>,RT<WR<R3>>,RT<WR<R4>>] };
  and(...rawSchemas: RawSchema[]): { type: SchemaType.And; schemas: RTA<WR<RawSchema>[]> };
}

export type IMethods = Omit<typeof methods, "and"> & IAndMethod;
