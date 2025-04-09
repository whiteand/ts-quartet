import { IFromRawSchema } from "./infer";
import { RawSchema } from "./IRawSchema";
import { rawSchemaToSchema } from "./rawSchemaToSchema";
import {
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
  SpecialProp,
  string,
  symbol,
  testSchema,
} from "./schemas";
import {
  IAndSchema,
  IArrayOfSchema,
  ICustomSchema,
  IStringSchema,
  ITester,
  ITestSchema,
  TCustomValidator,
} from "./types";

const EMAIL_REGEX =
  /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i;

export const methods = {
  and<const RR extends readonly RawSchema[]>(
    ...rawSchemas: RR
  ): IAndSchema & IFromRawSchema<RR> {
    return and(rawSchemas.map(rawSchemaToSchema)) as IAndSchema &
      IFromRawSchema<RR>;
  },
  any: anySchema(),
  array: array(),
  arrayOf<const E extends RawSchema>(
    rawElementSchema: E,
  ): IArrayOfSchema & IFromRawSchema<E> {
    const elementSchema = rawSchemaToSchema(rawElementSchema);
    return arrayOf<E>(elementSchema);
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
  pair(rawKeyValueSchema: RawSchema) {
    const keyValueSchema = rawSchemaToSchema(rawKeyValueSchema);
    return pair(keyValueSchema);
  },
  positive: positive(),
  rest: SpecialProp.Rest as SpecialProp.Rest,
  restOmit: SpecialProp.RestOmit as SpecialProp.RestOmit,
  safeInteger: safeInteger(),
  string: string(),
  symbol: symbol(),
  email: and([string(), testSchema(EMAIL_REGEX)]) as IAndSchema &
    IFromRawSchema<
      readonly [IStringSchema, ITestSchema & IFromRawSchema<RegExp>]
    >,
  test<const T extends ITester>(tester: T): ITestSchema & IFromRawSchema<T> {
    return testSchema(tester);
  },
  custom<const T extends TCustomValidator>(
    customValidator: T,
    description?: string,
  ): ICustomSchema & IFromRawSchema<T> {
    return custom(customValidator, description) as ICustomSchema &
      IFromRawSchema<T>;
  },
};

export type IMethods = typeof methods;
