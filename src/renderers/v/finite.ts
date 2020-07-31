import { ISchemaRenderer } from '../../types'
import { getSimpleCondition } from './utils'

export const finiteRenderer: ISchemaRenderer<null> = getSimpleCondition(
  valueId => `Number.isFinite(${valueId})`,
  valueId => `!Number.isFinite(${valueId})`,
)
