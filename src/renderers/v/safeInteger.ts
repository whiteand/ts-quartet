import { getSimpleCondition } from './utils'

export const safeIntegerRenderer = getSimpleCondition<null>(
  valueId => `Number.isSafeInteger(${valueId})`,
  valueId => `!Number.isSafeInteger(${valueId})`,
)
