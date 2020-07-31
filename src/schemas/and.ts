import { SchemaType } from './SchemaType'
import { AndSchema } from '../types'

export function and(...schemas): AndSchema {
  return {
    type: SchemaType.And,
    schemas,
  }
}
