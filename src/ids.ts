import { IAndSchema, PairSchema } from './types'

export const AND_SCHEMA_ID: '__quartet/and__' = '__quartet/and__'

export function isAndSchema(schema: any): schema is IAndSchema {
  return schema && Array.isArray(schema) && schema[0] === AND_SCHEMA_ID
}
export const PAIR_SCHEMA_ID: '__quartet/pair__' = '__quartet/pair__'

export function isPairSchema(schema: any): schema is PairSchema {
  return schema && Array.isArray(schema) && schema[0] === PAIR_SCHEMA_ID
}
