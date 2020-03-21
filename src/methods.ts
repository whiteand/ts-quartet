import { IMethods } from "./types";

export const methods: IMethods = {
  bigint: () => ({
    check: valueId => `typeof ${valueId} === 'bigint'`,
    not: valueId => `typeof ${valueId} !== 'bigint'`
  }),
  boolean: () => ({
    check: valueId => `typeof ${valueId} === 'boolean'`,
    not: valueId => `typeof ${valueId} !== 'boolean'`
  }),
  function: () => ({
    check: valueId => `typeof ${valueId} === 'function'`,
    not: valueId => `typeof ${valueId} !== 'function'`
  }),
  number: () => ({
    check: valueId => `typeof ${valueId} === 'number'`,
    not: valueId => `typeof ${valueId} !== 'number'`
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
