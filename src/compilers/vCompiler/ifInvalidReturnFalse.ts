import { SchemaType } from '../../schemas'
import { TSchema } from '../../types'
import { getAccessorWithAlloc, has } from '../../utils'
import { getValidatorFromSchema } from './getValidatorFromSchema'

function fromNegation(negationConditionCode: string) {
  return `if (${negationConditionCode}) return false`
}

export function ifInvalidReturnFalse(
  schema: TSchema,
  alloc: (varName: string, initialValue: any, singleton?: boolean) => string,
  valueAddress: string,
  keyAddress: string | number | undefined,
): string {
  if (schema === null) {
    return fromNegation(`${valueAddress} !== null`)
  }
  if (schema === undefined) {
    return fromNegation(`${valueAddress} !== undefined`)
  }
  if (typeof schema !== 'object') {
    const primitiveValueAddress = alloc('primitive', schema)
    return fromNegation(`${valueAddress} !== ${primitiveValueAddress}`)
  }
  switch (schema.type) {
    case SchemaType.And:
      const ifInvalidReturnFalseStatements = schema.schemas.map(innerSchema =>
        ifInvalidReturnFalse(innerSchema, alloc, valueAddress, keyAddress),
      )
      return ifInvalidReturnFalseStatements.join('\n')
    case SchemaType.Any:
      return ''
    case SchemaType.Array:
      return fromNegation(`!Array.isArray(${valueAddress})`)
    case SchemaType.ArrayOf:
      const { elementSchema } = schema
      const incrementVar = alloc('i', 0)
      const elementVar = alloc('e', undefined)
      const checkIsArray = `if (!Array.isArray(${valueAddress})) return false;`
      const checkElements = `
        for (${incrementVar} = 0; ${incrementVar} < ${valueAddress}.length; ${incrementVar}++) {
            ${elementVar} = ${valueAddress}[${incrementVar}];
            ${ifInvalidReturnFalse(elementSchema, alloc, elementVar, incrementVar)}
        }
      `
      return [checkIsArray, checkElements].join('\n')
    case SchemaType.Boolean:
      return fromNegation(`typeof ${valueAddress} !== 'boolean'`)
    case SchemaType.Finite:
      return fromNegation(`!Number.isFinite(${valueAddress})`)
    case SchemaType.Function:
      return fromNegation(`typeof ${valueAddress} !== 'function'`)
    case SchemaType.Max:
      const maxValueVar = alloc('maxValue', schema.maxValue)

      return schema.isExclusive
        ? fromNegation(`${valueAddress} >= ${maxValueVar}`)
        : fromNegation(`${valueAddress} > ${maxValueVar}`)
    case SchemaType.MaxLength:
      const maxLengthVar = alloc('maxLength', schema.maxLength)

      return schema.isExclusive
        ? fromNegation(
            `${valueAddress} == null || ${valueAddress}.length >= ${maxLengthVar}`,
          )
        : fromNegation(
            `${valueAddress} == null || ${valueAddress}.length > ${maxLengthVar}`,
          )
    case SchemaType.Min:
      const minValueVar = alloc('minValue', schema.minValue)

      return schema.isExclusive
        ? fromNegation(`${valueAddress} <= ${minValueVar}`)
        : fromNegation(`${valueAddress} < ${minValueVar}`)
    case SchemaType.MinLength:
      const minLengthVar = alloc('minLength', schema.minLength)

      return schema.isExclusive
        ? fromNegation(
            `${valueAddress} == null || ${valueAddress}.length <= ${minLengthVar}`,
          )
        : fromNegation(
            `${valueAddress} == null || ${valueAddress}.length < ${minLengthVar}`,
          )
    case SchemaType.Negative:
      return fromNegation(`${valueAddress} >= 0`)
    case SchemaType.Never:
      return 'return false'
    case SchemaType.Not:
      const isValid = getValidatorFromSchema(schema.schema, keyAddress)
      const isValidVar = alloc('isValid', isValid)
      return `if (${isValidVar}(${valueAddress})) return false`
    case SchemaType.NotANumber:
      return fromNegation(`!Number.isNaN(${valueAddress})`)
    case SchemaType.Number:
      return fromNegation(`typeof ${valueAddress} !== 'number'`)
    case SchemaType.Object:
      const statements: string[] = []
      const checkIsNotNull = `if (${valueAddress} == null) return false`
      const checkEachDefinedPropStatements = schema.props.map(prop => {
        const propSchema = schema.propsSchemas[prop]
        const propAccessor = getAccessorWithAlloc(prop, alloc)
        const checkPropStatement = ifInvalidReturnFalse(
          propSchema,
          alloc,
          `${valueAddress}${propAccessor}`,
          JSON.stringify(prop),
        )
        return checkPropStatement
      })
      statements.push(checkIsNotNull, ...checkEachDefinedPropStatements)
      if (schema.hasRestValidator) {
        const restOmitDictVar = alloc('ro', schema.restOmitDict)
        const restPropsVar = alloc('r', [])
        const incVar = alloc('i', 0)
        statements.push(`${restPropsVar} = Object.keys(${valueAddress})`)
        statements.push(
          `for (${incVar} = 0; ${incVar} < ${restPropsVar}.length; ${incVar}++) {`,
        )
        const restPropVar = alloc('rp', undefined)
        statements.push(`${restPropVar} = ${restPropsVar}[${incVar}];`)
        const propsSchemasVar = alloc('ps', schema.propsSchemas)
        const hasVar = alloc('has', has, true)
        statements.push(
          `if (${hasVar}(${propsSchemasVar}, ${restPropVar}) || ${restOmitDictVar}[${restPropVar}] === true) continue;`,
        )
        const restValueVar = alloc('rv', undefined)
        statements.push(`${restValueVar} = ${valueAddress}[${restPropVar}]`)
        statements.push(
          ifInvalidReturnFalse(schema.rest, alloc, restValueVar, restPropVar),
        )
        statements.push('}')
      }
      return statements.join('\n')

    case SchemaType.Pair:
      const pairVar = alloc('pair', { value: undefined, key: undefined })
      return [
        `${pairVar}.value = ${valueAddress}`,
        `${pairVar}.key = ${keyAddress}`,
        `${ifInvalidReturnFalse(schema.keyValueSchema, alloc, pairVar, keyAddress)}`,
      ].join('\n')
    case SchemaType.Positive:
      return fromNegation(`${valueAddress} <= 0`)
    case SchemaType.SafeInteger:
      return fromNegation(`!Number.isSafeInteger(${valueAddress})`)
    case SchemaType.String:
      return fromNegation(`typeof ${valueAddress} !== 'string'`)
    case SchemaType.Symbol:
      return fromNegation(`typeof ${valueAddress} !== 'symbol'`)
    case SchemaType.Test:
      const testerVar = alloc('t', schema.tester)
      return fromNegation(`!${testerVar}.test(${valueAddress})`)
    case SchemaType.Variant:
      const isOneOf = getValidatorFromSchema(schema, keyAddress)
      const isOneOfVar = alloc('cv', isOneOf)
      return fromNegation(`!${isOneOfVar}(${valueAddress})`)
    case SchemaType.Custom:
      const customVar = alloc('custom', schema.customValidator)
      return fromNegation(`!${customVar}(${valueAddress})`)
    default:
      throw new Error('Not implemented')
  }
}
