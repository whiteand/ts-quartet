import { addTabs } from "./addTabs";
import { constantToFunc } from "./constantToFunc";
import { getKeyAccessor } from "./getKeyAccessor";
import { handleSchema } from "./handleSchema";
import { methods } from "./methods";
import { toContext } from "./toContext";
import { toDict } from "./toDict";
import { CompilationResult, Prepare, Schema } from "./types";

function defaultHandler(
  c: (schema: Schema) => CompilationResult,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[]
): [string, boolean] {
  const compiled = c(schema);
  const [id, prepare] = toContext(valueId, compiled);
  preparations.push(prepare);
  const idAcc = getKeyAccessor(id);
  const funcSchema = compiled.pure
    ? () => ({
        check: () => `${ctxId}${idAcc}(${valueId})`,
        not: () => `!${ctxId}${idAcc}(${valueId})`
      })
    : () => ({
        check: () => `${ctxId}${idAcc}(${valueId})`,
        handleError: () =>
          `${ctxId}.explanations.push(...${ctxId}${idAcc}.explanations)`,
        not: () => `!${ctxId}${idAcc}(${valueId})`
      });
  return compileIfNotValidReturnFalse(
    c,
    valueId,
    ctxId,
    funcSchema,
    preparations
  );
}

export function compileIfNotValidReturnFalse(
  c: (schema: Schema) => CompilationResult,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[]
): [string, boolean] {
  return handleSchema<[string, boolean]>({
    constant: constant =>
      compileIfNotValidReturnFalse(
        c,
        valueId,
        ctxId,
        constantToFunc(constant),
        preparations
      ),
    function: funcSchema => {
      const s = funcSchema();
      if (s.prepare) {
        preparations.push(s.prepare);
      }
      const notCheck = s.not
        ? s.not(valueId, ctxId)
        : `!(${s.check(valueId, ctxId)})`;
      return [
        s.handleError
          ? `if (${notCheck}) {\n${addTabs(
              s.handleError(valueId, ctxId)
            )}\n  return false\n}`
          : `if (${notCheck}) return false`,
        !s.handleError
      ];
    },
    object: objectSchema => {
      const keys = Object.keys(objectSchema);
      const codeLines = [`if (${valueId} == null) return false`];
      const important: string[] = [];
      let isPure = true;
      // tslint:disable-next-line
      for (let i = 0; i < keys.length; i++) {
        const innerKey = keys[i];
        const innerKeyAccessor = getKeyAccessor(innerKey);
        const keyValidValues: Array<string | symbol> = [];
        const innerKeyId = valueId + innerKeyAccessor;
        const [code, isPurePart] = compileIfNotValidReturnFalse(
          c,
          innerKeyId,
          ctxId,
          objectSchema[innerKey],
          preparations
        );
        if (!isPurePart) {
          isPure = false;
        }

        if (keyValidValues.length > 0) {
          for (const valid of keyValidValues) {
            const [keyConstantId, prepare] = toContext(innerKeyId, valid);
            const keyConstantAcc = getKeyAccessor(keyConstantId);
            preparations.push(prepare);
            important.push(
              `if (${innerKeyId} !== ${ctxId}${keyConstantAcc}) return false`
            );
          }
        }
        if (code) {
          codeLines.push(code);
        }
      }
      codeLines.splice(1, 0, ...important);
      return [codeLines.join("\n"), isPure];
    },
    objectRest: objectSchemaWithRest => {
      const {
        [methods.rest]: restValidator,
        [methods.restOmit]: omitKeys,
        ...objectSchema
      } = objectSchemaWithRest;
      const objectSchemaKeys = Object.keys(objectSchema);

      const [checkIsObject, isCheckObjectPure] =
        objectSchemaKeys.length > 0
          ? compileIfNotValidReturnFalse(
              c,
              valueId,
              ctxId,
              objectSchema,
              preparations
            )
          : [`if (${valueId} == null) return false`, true];
      const [elemId, prepareElem] = toContext("elem", undefined);
      const [keysId, prepareKeysId] = toContext("keys", []);
      const getElem = `${ctxId}${getKeyAccessor(elemId)}`;
      const getKeys = `${ctxId}${getKeyAccessor(keysId)}`;
      preparations.push(prepareElem, prepareKeysId);
      const [forLoopBody, forLoopBodyIsPure] = compileIfNotValidReturnFalse(
        c,
        getElem,
        ctxId,
        restValidator,
        preparations
      );
      const keysToBeOmmited = [...(omitKeys || []), ...objectSchemaKeys];
      if (keysToBeOmmited && keysToBeOmmited.length > 0) {
        const [omitKeysId, prepareOmitKeys] = toContext(
          "omitkeys",
          toDict(keysToBeOmmited)
        );
        const [keyId, prepareKey] = toContext("key", undefined);
        preparations.push(prepareOmitKeys, prepareKey);
        const getOmitKeysId = `${ctxId}${getKeyAccessor(omitKeysId)}`;
        const getKey = `${ctxId}${getKeyAccessor(keyId)}`;
        return [
          `${checkIsObject}\n${getKeys} = Object.keys(${valueId})\nfor (let i = 0; i < ${getKeys}.length; i++) {\n  ${getKey} = ${getKeys}[i]\n  if (${getOmitKeysId}[${getKey}] === true) continue\n  ${getElem} = ${valueId}[${getKey}]\n${addTabs(
            forLoopBody
          )}\n}
            `,
          isCheckObjectPure && forLoopBodyIsPure
        ];
      } else {
        return [
          `${checkIsObject}\n${getKeys} = Object.keys(${valueId})\nfor (let i = 0; i < ${getKeys}.length; i++) {\n  ${getElem} = ${valueId}[${getKeys}[i]]\n${addTabs(
            forLoopBody
          )}\n}
              `,
          isCheckObjectPure && forLoopBodyIsPure
        ];
      }
    },
    variant: schemas => {
      if (schemas.length === 0) {
        return [`return false`, true];
      }
      if (schemas.length === 1) {
        return compileIfNotValidReturnFalse(
          c,
          valueId,
          ctxId,
          schemas[0],
          preparations
        );
      }
      return defaultHandler(c, valueId, ctxId, schemas, preparations);
    }
  })(schema);
}
