import { addTabs } from './addTabs'
import { constantToFunc } from './constantToFunc'
import { getKeyAccessor } from './getKeyAccessor'
import { handleSchema } from './handleSchema'
import { methods } from './methods'
import { toDict } from './toDict'
import { Prepare, QuartetInstance, Schema } from './types'

export function compileIfNotValidReturnFalse(
  v: QuartetInstance,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  parentKey: string | null,
): [string, boolean] {
  return handleSchema<[string, boolean]>({
    and: andSchema => {
      let bodyCode = ''
      let isPure = true
      for (let i = 1; i < andSchema.length; i++) {
        const [anotherCode, anotherIsPure] = compileIfNotValidReturnFalse(
          v,
          valueId,
          ctxId,
          andSchema[i],
          preparations,
          parentKey,
        )
        bodyCode += (bodyCode ? '\n' : '') + anotherCode
        if (!anotherIsPure) {
          isPure = false
        }
      }
      return [bodyCode, isPure]
    },
    pair: pairSchema => {
      if (!parentKey) {
        throw new Error('Wrong usage of v.pair')
      }

      const keyValueSchema = pairSchema[1]

      const compiled = v.pureCompile(keyValueSchema)
      const [validatorId, prepare] = v.toContext(valueId, compiled)
      const validatorAcc = getKeyAccessor(validatorId)
      const [keyValueObjId, prepareKeyValue] = v.toContext('keyvalue', {
        key: undefined,
        value: undefined,
      })
      const keyValueObjAcc = getKeyAccessor(keyValueObjId)
      preparations.push(prepare, prepareKeyValue)

      if (compiled.pure) {
        return [
          `${ctxId}${keyValueObjAcc}.key = ${parentKey};\n${ctxId}${keyValueObjAcc}.value = ${valueId};\nif (!${ctxId}${validatorAcc}(${ctxId}${keyValueObjAcc})) return false;`,
          true,
        ]
      }

      return [
        `${ctxId}${keyValueObjAcc}.key = ${parentKey};\n${ctxId}${keyValueObjAcc}.value = ${valueId};\nif (!${ctxId}${validatorAcc}(${ctxId}${keyValueObjAcc})) {\n  ${ctxId}.explanations.push(...${ctxId}${validatorAcc}.explanations);\n  return false\n}`,
        false,
      ]
    },
    constant: constant =>
      compileIfNotValidReturnFalse(
        v,
        valueId,
        ctxId,
        constantToFunc(v, constant),
        preparations,
        parentKey,
      ),
    function: funcSchema => {
      const s = funcSchema()
      if (s.prepare) {
        preparations.push(s.prepare)
      }
      const notCheck = s.not ? s.not(valueId, ctxId) : `!(${s.check(valueId, ctxId)})`
      return [
        s.handleError
          ? `if (${notCheck}) {\n${addTabs(
              s.handleError(valueId, ctxId),
            )}\n  return false\n}`
          : `if (${notCheck}) return false`,
        !s.handleError,
      ]
    },
    object: objectSchema => {
      const keys = Object.keys(objectSchema)
      const codeLines = [`if (${valueId} == null) return false`]
      const important: string[] = []
      let isPure = true
      // tslint:disable-next-line
      for (let i = 0; i < keys.length; i++) {
        const innerKey = keys[i]
        const innerKeyAccessor = getKeyAccessor(innerKey)
        const innerKeyId = valueId + innerKeyAccessor
        const [code, isPurePart] = compileIfNotValidReturnFalse(
          v,
          innerKeyId,
          ctxId,
          objectSchema[innerKey],
          preparations,
          null,
        )
        if (!isPurePart) {
          isPure = false
        }
        if (code) {
          codeLines.push(code)
        }
      }
      codeLines.splice(1, 0, ...important)
      return [codeLines.join('\n'), isPure]
    },
    objectRest: objectSchemaWithRest => {
      const {
        [methods.rest]: restValidator,
        [methods.restOmit]: omitKeys,
        ...objectSchema
      } = objectSchemaWithRest
      const objectSchemaKeys = Object.keys(objectSchema)

      const [checkIsObject, isCheckObjectPure] =
        objectSchemaKeys.length > 0
          ? compileIfNotValidReturnFalse(
              v,
              valueId,
              ctxId,
              objectSchema,
              preparations,
              null,
            )
          : [`if (${valueId} == null) return false`, true]
      const [elemId, prepareElem] = v.toContext('elem', undefined)
      const [keysId, prepareKeysId] = v.toContext('keys', [])
      const getElem = `${ctxId}${getKeyAccessor(elemId)}`
      const getKeys = `${ctxId}${getKeyAccessor(keysId)}`
      preparations.push(prepareElem, prepareKeysId)
      const [keyId, prepareKey] = v.toContext('key', undefined)
      const getKey = `${ctxId}${getKeyAccessor(keyId)}`
      const [forLoopBody, forLoopBodyIsPure] = compileIfNotValidReturnFalse(
        v,
        getElem,
        ctxId,
        restValidator,
        preparations,
        getKey,
      )

      const [index, prepareI] = v.toContext('i', 0)
      const iAcc = getKeyAccessor(index)
      preparations.push(prepareI)

      const keysToBeOmmited = [...(omitKeys || []), ...objectSchemaKeys]
      if (keysToBeOmmited && keysToBeOmmited.length > 0) {
        const [omitKeysId, prepareOmitKeys] = v.toContext(
          'omitkeys',
          toDict(keysToBeOmmited),
        )

        preparations.push(prepareOmitKeys, prepareKey)
        const getOmitKeysId = `${ctxId}${getKeyAccessor(omitKeysId)}`

        return [
          `${checkIsObject}\n${getKeys} = Object.keys(${valueId})\nfor (${ctxId}${iAcc} = 0; ${ctxId}${iAcc} < ${getKeys}.length; ${ctxId}${iAcc}++) {\n  ${getKey} = ${getKeys}[${ctxId}${iAcc}]\n  if (${getOmitKeysId}[${getKey}] === true) continue\n  ${getElem} = ${valueId}[${getKey}]\n${addTabs(
            forLoopBody,
          )}\n}`,
          isCheckObjectPure && forLoopBodyIsPure,
        ]
      } else {
        return [
          `${checkIsObject}\n${getKeys} = Object.keys(${valueId})\nfor (${ctxId}${iAcc} = 0; ${ctxId}${iAcc} < ${getKeys}.length; ${ctxId}${iAcc}++) {\n  ${getKey} = ${getKeys}[${ctxId}${iAcc}]\n  ${getElem} = ${valueId}[${getKey}]\n${addTabs(
            forLoopBody,
          )}\n}`,
          isCheckObjectPure && forLoopBodyIsPure,
        ]
      }
    },
    variant: schemas => {
      if (schemas.length === 0) {
        return [`return false`, true]
      }
      if (schemas.length === 1) {
        return compileIfNotValidReturnFalse(
          v,
          valueId,
          ctxId,
          schemas[0],
          preparations,
          parentKey,
        )
      }

      const compiled = v.pureCompile(schemas)
      const [id, prepare] = v.toContext(valueId, compiled)
      preparations.push(prepare)
      const idAcc = getKeyAccessor(id)
      const funcSchema = compiled.pure
        ? () => ({
            check: () => `${ctxId}${idAcc}(${valueId})`,
            not: () => `!${ctxId}${idAcc}(${valueId})`,
          })
        : () => ({
            check: () => `${ctxId}${idAcc}(${valueId})`,
            handleError: () =>
              `${ctxId}.explanations.push(...${ctxId}${idAcc}.explanations)`,
            not: () => `!${ctxId}${idAcc}(${valueId})`,
          })
      return compileIfNotValidReturnFalse(
        v,
        valueId,
        ctxId,
        funcSchema,
        preparations,
        parentKey,
      )
    },
  })(schema)
}
