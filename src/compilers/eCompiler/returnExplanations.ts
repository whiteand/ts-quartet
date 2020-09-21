import { TSchema } from '../../types'
import { explanation } from './explanation'
import { IExplanation } from '../../explanations'
import { SchemaType } from '../../schemas/SchemaType'
import { getExplanator } from './getExplanator'

const VALUE_TEMPLATE = 'quartet_@@value@@template_quartet'
const PATH_TEMPLATE = 'quartet_@@PATH@@template_quartet'
function renderExplanation(valueVar: string, pathVar: string, schema: TSchema): string {
  const exp = explanation(VALUE_TEMPLATE, [PATH_TEMPLATE], schema)
  const jsonExp = JSON.stringify(exp)
  const withReplacedValue = jsonExp.split(`"${VALUE_TEMPLATE}"`).join(valueVar)
  const withReplacedPathAndValue = withReplacedValue
    .split(`["${PATH_TEMPLATE}"]`)
    .join(pathVar)
  return withReplacedPathAndValue
}

export function returnExplanations(
  schema: TSchema,
  alloc: (varName: string, initialValue: any) => string,
  valueVar: string,
  pathVar: string,
): string[] {
  if (typeof schema !== 'object' || schema === null) {
    const constantVar = alloc('c', schema)
    const statements: string[] = []
    statements.push(
      `if (${valueVar} !== ${constantVar}) return [${renderExplanation(
        valueVar,
        pathVar,
        schema,
      )}]`,
    )
    return statements
  }
  switch (schema.type) {
    // case SchemaType.And:
    case SchemaType.Any:
      return []
    // case SchemaType.Array:
    // case SchemaType.ArrayOf:
    // case SchemaType.Boolean:
    // case SchemaType.Finite:
    // case SchemaType.Function:
    // case SchemaType.Max:
    // case SchemaType.MaxLength:
    // case SchemaType.Min:
    // case SchemaType.MinLength:
    // case SchemaType.Negative:
    case SchemaType.Never:
      return [`return [${renderExplanation(valueVar, pathVar, schema)}]`]
    // case SchemaType.Not:
    // case SchemaType.NotANumber:
    // case SchemaType.Number:
    // case SchemaType.Object:
    // case SchemaType.Pair:
    case SchemaType.Positive:
      return [
        `if (!(${valueVar} > 0)) {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    case SchemaType.SafeInteger:
      return [
        `if (!Number.isSafeInteger(${valueVar})) {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    case SchemaType.String:
      return [
        `if (typeof ${valueVar} !== 'string') {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    case SchemaType.Symbol:
      return [
        `if (typeof ${valueVar} !== 'symbol') {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]

    case SchemaType.Test:
      const testerVar = alloc('tester', schema.tester)
      return [
        `if (!${testerVar}.test(${valueVar})) {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    case SchemaType.Variant:
      const variantExplanator = getExplanator(schema)
      const explanatorVar = alloc('variantExp', variantExplanator)
    case SchemaType.Custom:
      const customValidatorVar = alloc('tester', schema.customValidator)
      return [
        `if (!${customValidatorVar}(${valueVar})) {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
  }
  return []
}
