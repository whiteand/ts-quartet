import { compileAnd } from "./compileAnd";
import { IMethods, Schema, TypedCompilationResult } from "./types";
import { arrayOf } from "./compileArrayOf";
import { toContext } from "./toContext";

export const methods: IMethods = {
  and(...schemas: Schema[]) {
    return this.custom(compileAnd(this as any, schemas));
  },
  arrayOf(schema: Schema) {
    return this.custom(arrayOf(this as any, schema));
  },
  bigint: () => ({
    check: valueId => `typeof ${valueId} === 'bigint'`,
    not: valueId => `typeof ${valueId} !== 'bigint'`
  }),
  boolean: () => ({
    check: valueId => `typeof ${valueId} === 'boolean'`,
    not: valueId => `typeof ${valueId} !== 'boolean'`
  }),
  compileAnd<T>(...schemas: Schema[]) {
    return compileAnd(this as any, schemas) as TypedCompilationResult<T>;
  },
  compileArrayOf<T>(schema: Schema) {
    return arrayOf(this as any, schema) as TypedCompilationResult<T[]>;
  },
  custom: (check: (value: any, explanation: any) => boolean) => () => {
    const [checkId, prepare] = toContext("custom", check);

    return {
      check: (id: any, ctx: any) => `${ctx}['${checkId}'](${id})`,
      not: (id: any, ctx: any) => `!${ctx}['${checkId}'](${id})`,
      prepare
    };
  },
  function: () => ({
    check: valueId => `typeof ${valueId} === 'function'`,
    not: valueId => `typeof ${valueId} !== 'function'`
  }),
  negative: () => ({
    check: valueId => `${valueId} < 0`,
    not: valueId => `${valueId} >= 0`
  }),
  number: () => ({
    check: valueId => `typeof ${valueId} === 'number'`,
    not: valueId => `typeof ${valueId} !== 'number'`
  }),
  positive: () => ({
    check: valueId => `${valueId} > 0`,
    not: valueId => `${valueId} <= 0`
  }),
  rest: "__quartet/rest__",
  safeInteger: () => ({
    check: valueId => `Number.isSafeInteger(${valueId})`,
    not: valueId => `!Number.isSafeInteger(${valueId})`
  }),
  string: () => ({
    check: valueId => `typeof ${valueId} === 'string'`,
    not: valueId => `typeof ${valueId} !== 'string'`
  }),
  symbol: () => ({
    check: valueId => `typeof ${valueId} === 'symbol'`,
    not: valueId => `typeof ${valueId} !== 'symbol'`
  })
};
