import { SchemaType } from './SchemaType'
import { BooleanSchema } from '../types'

const BOOLEAN_SCHEMA = {
  type: SchemaType.Boolean,
}

export function array(): BooleanSchema {
  return BOOLEAN_SCHEMA
}
