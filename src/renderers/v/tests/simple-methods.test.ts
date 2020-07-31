import { booleanRenderer } from '../boolean'
import { finiteRenderer } from '../finite'
import { functionRenderer } from '../function'
import { numberRenderer } from '../number'
import { stringRenderer } from '../string'
import { symbolRenderer } from '../symbol'
import { positiveRenderer } from '../positive'
import { negativeRenderer } from '../negative'
import { safeIntegerRenderer } from '../safeInteger'
import { snapshot } from './snapshot'

describe('simple methods', () => {
  test('v.boolean', () => {
    snapshot(booleanRenderer, { schema: null })
  })
  test('v.finite', () => {
    snapshot(finiteRenderer, { schema: null })
  })
  test('v.function', () => {
    snapshot(functionRenderer, { schema: null })
  })
  test('v.number', () => {
    snapshot(numberRenderer, { schema: null })
  })
  test('v.string', () => {
    snapshot(stringRenderer, { schema: null })
  })
  test('v.symbol', () => {
    snapshot(symbolRenderer, { schema: null })
  })
  test('v.positive', () => {
    snapshot(positiveRenderer, { schema: null })
  })
  test('v.negative', () => {
    snapshot(negativeRenderer, { schema: null })
  })
  test('v.safeInteger', () => {
    snapshot(safeIntegerRenderer, { schema: null })
  })
})
