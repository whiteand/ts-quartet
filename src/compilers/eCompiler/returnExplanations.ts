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
    case SchemaType.Variant:
    case SchemaType.Not:
    case SchemaType.Pair:
      const explanator = getExplanator(schema)
      const explanatorVar = alloc('variantExp', explanator)
      const explanationsVar = alloc('exps', null)
      return [
        `${explanationsVar} = ${explanatorVar}(${valueVar}, ${pathVar})`,
        `if (${explanationsVar}) {`,
        `  return ${explanationsVar}`,
        `}`,
      ]
    case SchemaType.And:
      const andStatements: string[] = []
      for (let i = 0; i < schema.schemas.length; i++) {
        const innerSchema = schema.schemas[i]
        andStatements.push(...returnExplanations(innerSchema, alloc, valueVar, pathVar))
      }
      return andStatements
    case SchemaType.Any:
      return []
    case SchemaType.Array:
      return [
        `if (!Array.isArray(${valueVar})) {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    case SchemaType.ArrayOf:
      const arrayOfStatements: string[] = []
      arrayOfStatements.push(
        `if (!Array.isArray(${valueVar})) return [${renderExplanation(
          valueVar,
          pathVar,
          schema,
        )}] `,
      )
      const indexVar = alloc('i', 0)
      const newPathVar = alloc('np', [])
      const elemVar = alloc('e', undefined)
      arrayOfStatements.push(
        `for (${indexVar} = 0; ${indexVar} < ${valueVar}.length; ${indexVar}++) {`,
        `  ${elemVar} = ${valueVar}[${indexVar}]`,
        `  ${newPathVar} = ${pathVar}.concat([${indexVar}])`,
        ...returnExplanations(schema.elementSchema, alloc, elemVar, newPathVar),
        `}`,
      )

      return arrayOfStatements
    case SchemaType.Boolean:
      return [
        `if (typeof ${valueVar} !== 'boolean') {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    case SchemaType.Finite:
      return [
        `if (!Number.isFinite(${valueVar})) {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    case SchemaType.Function:
      return [
        `if (typeof ${valueVar} !== 'function') {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    // case SchemaType.Max:
    // case SchemaType.MaxLength:
    // case SchemaType.Min:
    // case SchemaType.MinLength:
    case SchemaType.Negative:
      return [
        `if (!(${valueVar} < 0)) {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    case SchemaType.Never:
      return [`return [${renderExplanation(valueVar, pathVar, schema)}]`]
    case SchemaType.NotANumber:
      return [
        `if (!Number.isNaN(${valueVar})) {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    case SchemaType.Number:
      return [
        `if (typeof ${valueVar} !== 'number') {`,
        `  return [${renderExplanation(valueVar, pathVar, schema)}]`,
        `}`,
      ]
    // case SchemaType.Object:

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
