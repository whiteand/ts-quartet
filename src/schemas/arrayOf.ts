import { SchemaType } from './SchemaType'
import { ArrayOfSchema, TSchema } from '../types'

export function arrayOf(elementSchema: TSchema): ArrayOfSchema {
  return {
    type: SchemaType.ArrayOf,
    elementSchema,
  }
}
