import { SchemaType } from './SchemaType'
import { ArraySchema } from '../types'

const ARRAY_SCHEMA = {
  type: SchemaType.Array,
}

export function array(): ArraySchema {
  return ARRAY_SCHEMA
}
