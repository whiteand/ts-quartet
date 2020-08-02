import { Compiler } from "./Compiler";
import { vCompiler } from "./compilers/vCompiler";
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
import { CompilationResult, ITester, TCustomValidator } from "./types";

const methods = {
  and(...rawSchemas: RawSchema[]) {
    const schemas = rawSchemas.map(rawSchemaToSchema);
    return and(...schemas);
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

type VMethods = typeof methods;

export interface IQuartetInstance extends Compiler<any>, VMethods {}

export const v: IQuartetInstance = Object.assign(vCompiler, methods);
