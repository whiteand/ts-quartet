import { ISchemaRenderer } from '../../types'
import { getSimpleCondition } from './utils'

export const negativeRenderer: ISchemaRenderer<null> = getSimpleCondition(
  valueId => `${valueId} < 0`,
  valueId => `!(${valueId} < 0)`,
)
