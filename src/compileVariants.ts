import { addTabs } from "./addTabs";
import { constantToFunc } from "./constantToFunc";
import { getKeyAccessor } from "./getKeyAccessor";
import { handleSchema } from "./handleSchema";
import {
  CompilationResult,
  HandleError,
  IVariantSchema,
  Prepare,
  QuartetInstance,
  Schema
} from "./types";

function defaultHandler(
  v: QuartetInstance,
  index: number,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  handleErrors: HandleError[],
  stringsSymbols: Array<string | symbol>,
  numbers: number[],
  parentKey: string | null
): [string, boolean] {
  const compiled = v.pureCompile(schema);
  const [id, prepare] = v.toContext(index, compiled);
  preparations.push(prepare);
  const idAcc = getKeyAccessor(id);
  const funcSchema = compiled.pure
    ? () => ({
        check: () => `${ctxId}${idAcc}(${valueId})`
      })
    : () => ({
        check: () => `${ctxId}${idAcc}(${valueId})`,
        handleError: () =>
          `${ctxId}.explanations.push(...${ctxId}${idAcc}.explanations)`
      });
  return compileVariantElementToReturnWay(
    v,
    index,
    valueId,
    ctxId,
    funcSchema,
    preparations,
    handleErrors,
    stringsSymbols,
    numbers,
    parentKey
  );
}
function compileVariantElementToReturnWay(
  v: QuartetInstance,
  index: number,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  handleErrors: HandleError[],
  stringsSymbols: Array<string | symbol>,
  numbers: number[],
  parentKey: string | null
): [string, boolean] {
  return handleSchema<[string, boolean]>({
    and: andSchema =>
      defaultHandler(
        v,
        index,
        valueId,
        ctxId,
        andSchema,
        preparations,
        handleErrors,
        stringsSymbols,
        numbers,
        parentKey
      ),
    constant: constant => {
      if (constant === "false" || constant === "true") {
        return compileVariantElementToReturnWay(
          v,
          index,
          valueId,
          ctxId,
          constantToFunc(v, constant),
          preparations,
          handleErrors,
          stringsSymbols,
          numbers,
          parentKey
        );
      }
      if (typeof constant === "symbol" || typeof constant === "string") {
        stringsSymbols.push(constant);
        return ["", true];
      }
      if (typeof constant === "number" && !Number.isNaN(constant)) {
        numbers.push(constant);
        return ["", true];
      }
      return compileVariantElementToReturnWay(
        v,
        index,
        valueId,
        ctxId,
        constantToFunc(v, constant),
        preparations,
        handleErrors,
        stringsSymbols,
        numbers,
        parentKey
      );
    },
    function: funcSchema => {
      const s = funcSchema();

      if (s.prepare) {
        preparations.push(s.prepare);
      }
      if (s.handleError) {
        handleErrors.push(s.handleError);
      }
      return [`if (${s.check(valueId, ctxId)}) return true;`, !s.handleError];
    },

    object: objectSchema =>
      defaultHandler(
        v,
        index,
        valueId,
        ctxId,
        objectSchema,
        preparations,
        handleErrors,
        stringsSymbols,
        numbers,
        parentKey
      ),
    objectRest: objectSchema =>
      defaultHandler(
        v,
        index,
        valueId,
        ctxId,
        objectSchema,
        preparations,
        handleErrors,
        stringsSymbols,
        numbers,
        parentKey
      ),
    pair: pairSchema => {
      if (!parentKey) {
        throw new Error("Wrong usage of v.pair");
      }

      const keyValueSchema = pairSchema[1];

      const compiled = v.pureCompile(keyValueSchema);
      const [validatorId, prepare] = v.toContext(valueId, compiled);
      const validatorAcc = getKeyAccessor(validatorId);
      const [keyValueObjId, prepareKeyValue] = v.toContext("keyvalue", {
        key: undefined,
        value: undefined
      });
      const keyValueObjAcc = getKeyAccessor(keyValueObjId);
      preparations.push(prepare, prepareKeyValue);

      if (compiled.pure) {
        return [
          `${ctxId}${keyValueObjAcc}.key = ${parentKey};\n${ctxId}${keyValueObjAcc}.value = ${valueId};\nif (${ctxId}${validatorAcc}(${ctxId}${keyValueObjAcc})) return true;`,
          true
        ];
      }

      handleErrors.push(
        () =>
          `${ctxId}.explanations.push(...${ctxId}${validatorAcc}.explanations)`
      );

      return [
        `${ctxId}${keyValueObjAcc}.key = ${parentKey};\n${ctxId}${keyValueObjAcc}.value = ${valueId};\nif (${ctxId}${validatorAcc}(${ctxId}${keyValueObjAcc})) return true`,
        false
      ];
    },
    variant: schemas => {
      const res = [];
      let isPure = true;
      for (const variant of schemas) {
        const [codePart, isPartPure] = compileVariantElementToReturnWay(
          v,
          index,
          valueId,
          ctxId,
          variant,
          preparations,
          handleErrors,
          stringsSymbols,
          numbers,
          parentKey
        );
        if (!isPartPure) {
          isPure = false;
        }
        res.push(codePart);
      }
      return [res.join("\n"), isPure];
    }
  })(schema);
}

export function compileVariants(
  v: QuartetInstance,
  variants: IVariantSchema
): CompilationResult {
  if (variants.length === 0) {
    return Object.assign(() => false, { explanations: [], pure: true });
  }
  if (variants.length === 1) {
    return v.pureCompile(variants[0]);
  }
  const preparations: Prepare[] = [];
  const handleErrors: HandleError[] = [];
  const stringsSymbols: Array<string | symbol> = [];
  const numbers: number[] = [];
  const bodyCodeLines = [];
  let isPure = true;
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const [codePart, purePart] = compileVariantElementToReturnWay(
      v,
      i,
      `value`,
      `validator`,
      variant,
      preparations,
      handleErrors,
      stringsSymbols,
      numbers,
      null
    );
    if (!purePart) {
      isPure = false;
    }
    bodyCodeLines.push(codePart);
  }

  // tslint:disable-next-line
  const __validNumbersDict: Record<number, boolean> = {};
  if (numbers.length > 0) {
    // tslint:disable-next-line
    for (let i = 0; i < numbers.length; i++) {
      __validNumbersDict[numbers[i]] = true;
    }
    bodyCodeLines.unshift(
      `if (typeof value === 'number' && validator.__validNumbersDict[value] === true) return true`
    );
  }

  // tslint:disable-next-line
  const __validStringsAndSymbols: Record<string | symbol, boolean> = {};
  if (stringsSymbols.length > 0) {
    // tslint:disable-next-line
    for (let i = 0; i < stringsSymbols.length; i++) {
      __validStringsAndSymbols[stringsSymbols[i] as any] = true;
    }
    bodyCodeLines.unshift(
      `if ((typeof value === 'string' || typeof value === 'symbol') && validator.__validStringsAndSymbols[value] === true) return true`
    );
  }
  if (handleErrors.length > 0) {
    bodyCodeLines.push(
      ...handleErrors.map(handleError => handleError("value", "validator"))
    );
  }
  const bodyCode = bodyCodeLines
    .map(e => e.trim())
    .filter(Boolean)
    .join("\n");

  // tslint:disable-next-line
  const ctx = eval(
    `(() => {function validator(value) {${
      isPure ? "" : "\n  validator.explanations = []"
    }\n${addTabs(bodyCode)}\n  return false\n}
      return validator
    })()`
  );
  for (const prepare of preparations) {
    prepare(ctx);
  }
  ctx.explanations = [];
  ctx.pure = isPure;
  if (stringsSymbols.length > 0) {
    ctx.__validStringsAndSymbols = __validStringsAndSymbols;
  }
  if (numbers.length > 0) {
    ctx.__validNumbersDict = __validNumbersDict;
  }
  return ctx;
}
