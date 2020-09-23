import { RawSchema, rawSchemaToSchema } from "./rawSchemaToSchema";
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
  testSchema
} from "./schemas";
import { ITester, TCustomValidator } from "./types";

export const methods = {
  and(...rawSchemas: RawSchema[]) {
    return and(rawSchemas.map(rawSchemaToSchema));
  },
  any: anySchema(),
  array: array(),
  arrayOf(rawElementSchema: RawSchema) {
    const elementSchema = rawSchemaToSchema(rawElementSchema);
    return arrayOf(elementSchema);
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
  test(tester: ITester) {
    return testSchema(tester);
  },
  custom(customValidator: TCustomValidator) {
    return custom(customValidator);
  }
};

export type IMethods = typeof methods;
