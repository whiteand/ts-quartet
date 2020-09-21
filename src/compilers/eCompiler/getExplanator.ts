import { IExplanation } from '../../explanations'
import { TSchema } from '../../types'
import { explanation } from './explanation'
import { SchemaType } from '../../schemas/SchemaType'
import { getAlloc } from '../../getAlloc'
import { returnExplanations } from './returnExplanations'

export function getExplanator(
  schema: TSchema,
  path: KeyType[],
): (value: any) => null | IExplanation[] {
  if (typeof schema !== 'object' || schema === null) {
    return value => (value === schema ? null : [explanation(value, path, schema)])
  }
  switch (schema.type) {
    case SchemaType.And:
    case SchemaType.ArrayOf:
    case SchemaType.Object:
      const context: Record<string, any> = {}
      const contextParamName = 'ctx'
      const pathParamName = 'path'
      const alloc = getAlloc(context, contextParamName)
      const funcBody = `
        ${returnExplanations(schema, alloc, 'value', pathParamName).join('\n')}
        return null
      `
      const clonedPath = [...path]
      const explanator = new Function(
        'value',
        contextParamName,
        pathParamName,
        funcBody,
      ) as (value: any, context: any, path: KeyType[]) => null | IExplanation[]
      return value => explanator(value, context, clonedPath)
    case SchemaType.Any:
      return () => null
    case SchemaType.Array:
      return value => (Array.isArray(value) ? null : [explanation(value, path, schema)])
    case SchemaType.Boolean:
      return value =>
        typeof value === 'boolean' ? null : [explanation(value, path, schema)]
    case SchemaType.Finite:
      return value => (Number.isFinite(value) ? null : [explanation(value, path, schema)])
    case SchemaType.Function:
      return value =>
        typeof value === 'function' ? null : [explanation(value, path, schema)]
    case SchemaType.Max:
      return schema.isExclusive
        ? value => (value < schema.maxValue ? null : [explanation(value, path, schema)])
        : value => (value <= schema.maxValue ? null : [explanation(value, path, schema)])
    case SchemaType.MaxLength:
      return schema.isExclusive
        ? value =>
            value != null && value.length < schema.maxLength
              ? null
              : [explanation(value, path, schema)]
        : value =>
            value != null && value.length <= schema.maxLength
              ? null
              : [explanation(value, path, schema)]
    case SchemaType.Min:
      return schema.isExclusive
        ? value => (value > schema.minValue ? null : [explanation(value, path, schema)])
        : value => (value >= schema.minValue ? null : [explanation(value, path, schema)])
    case SchemaType.MinLength:
      return schema.isExclusive
        ? value =>
            value != null && value.length > schema.minLength
              ? null
              : [explanation(value, path, schema)]
        : value =>
            value != null && value.length >= schema.minLength
              ? null
              : [explanation(value, path, schema)]
    case SchemaType.Negative:
      return value => (value < 0 ? null : [explanation(value, path, schema)])

    case SchemaType.Never:
      return value => [explanation(value, path, schema)]
    case SchemaType.Not:
      const oppositeExplanator = getExplanator(schema.schema, path)
      return value => {
        if (!oppositeExplanator(value)) {
          return null
        }
        return [explanation(value, path, schema)]
      }
    case SchemaType.NotANumber:
      return value => (Number.isNaN(value) ? null : [explanation(value, path, schema)])
    case SchemaType.Number:
      return value =>
        typeof value === 'number' ? null : [explanation(value, path, schema)]
    case SchemaType.Pair:
      const pairValidationExplanator = getExplanator(schema.keyValueSchema, path)
      return value => {
        const pair = { value, key: path[path.length - 1] }
        return pairValidationExplanator(pair)
      }
    case SchemaType.Positive:
      return value => (value > 0 ? null : [explanation(value, path, schema)])
    case SchemaType.SafeInteger:
      return value =>
        Number.isSafeInteger(value) ? null : [explanation(value, path, schema)]
    case SchemaType.String:
      return value =>
        typeof value === 'string' ? null : [explanation(value, path, schema)]
    case SchemaType.Symbol:
      return value =>
        typeof value === 'symbol' ? null : [explanation(value, path, schema)]
    case SchemaType.Test:
      return value =>
        schema.tester.test(value) ? null : [explanation(value, path, schema)]
    case SchemaType.Custom:
      return value => {
        const { customValidator } = schema
        if (customValidator(value)) {
          return null
        }
        return [explanation(value, path, schema)]
      }
    case SchemaType.Variant:
      const explanators = schema.variants.map(variantSchema =>
        getExplanator(variantSchema, path),
      )
      return value => {
        const innerExplanations: IExplanation[] = []
        for (let i = 0; i < explanators.length; i++) {
          const explanator = explanators[i]
          if (!explanator(value)) {
            return null
          }
        }
        return [explanation(value, path, schema, innerExplanations)]
      }
  }
  return () => null
}
