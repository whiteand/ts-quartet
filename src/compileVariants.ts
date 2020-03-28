import { addTabs } from "./addTabs";
import { constantToFunc } from "./constantToFunc";
import { getKeyAccessor } from "./getKeyAccessor";
import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import {
  CompilationResult,
  HandleError,
  IVariantSchema,
  Prepare,
  Schema
} from "./types";

function defaultHandler(
  c: (schema: Schema) => CompilationResult,
  index: number,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  handleErrors: HandleError[],
  stringsSymbols: Array<string | number | symbol>
): [string, boolean] {
  const compiled = c(schema);
  const [id, prepare] = toContext(index, compiled);
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
    c,
    index,
    valueId,
    ctxId,
    funcSchema,
    preparations,
    handleErrors,
    stringsSymbols
  );
}
function compileVariantElementToReturnWay(
  c: (schema: Schema) => CompilationResult,
  index: number,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  handleErrors: HandleError[],
  stringsSymbols: Array<string | number | symbol>
): [string, boolean] {
  return handleSchema<[string, boolean]>({
    constant: constant => {
      if (constant === "false" || constant === "true") {
        return compileVariantElementToReturnWay(
          c,
          index,
          valueId,
          ctxId,
          constantToFunc(constant),
          preparations,
          handleErrors,
          stringsSymbols
        );
      }
      if (typeof constant === "symbol" || typeof constant === "string") {
        stringsSymbols.push(constant);
        return ["", true];
      }
      return compileVariantElementToReturnWay(
        c,
        index,
        valueId,
        ctxId,
        constantToFunc(constant),
        preparations,
        handleErrors,
        stringsSymbols
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
        c,
        index,
        valueId,
        ctxId,
        objectSchema,
        preparations,
        handleErrors,
        stringsSymbols
      ),
    objectRest: objectSchema =>
      defaultHandler(
        c,
        index,
        valueId,
        ctxId,
        objectSchema,
        preparations,
        handleErrors,
        stringsSymbols
      ),
    variant: schemas => {
      const res = [];
      let isPure = true;
      for (const variant of schemas) {
        const [codePart, isPartPure] = compileVariantElementToReturnWay(
          c,
          index,
          valueId,
          ctxId,
          variant,
          preparations,
          handleErrors,
          stringsSymbols
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
  c: (schema: Schema) => CompilationResult,
  variants: IVariantSchema
): CompilationResult {
  if (variants.length === 0) {
    return Object.assign(() => false, { explanations: [], pure: true });
  }
  if (variants.length === 1) {
    return c(variants[0]);
  }
  const preparations: Prepare[] = [];
  const handleErrors: HandleError[] = [];
  const stringsSymbols: Array<string | number | symbol> = [];
  const bodyCodeLines = [];
  let isPure = true;
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    const [codePart, purePart] = compileVariantElementToReturnWay(
      c,
      i,
      `value`,
      `validator`,
      variant,
      preparations,
      handleErrors,
      stringsSymbols
    );
    if (!purePart) {
      isPure = false;
    }
    bodyCodeLines.push(codePart);
  }
  // tslint:disable-next-line
  let __validValuesDict = {};
  if (stringsSymbols.length > 0) {
    __validValuesDict = stringsSymbols.reduce((dict: any, el) => {
      dict[el] = true;
      return dict;
    }, {});
    bodyCodeLines.unshift(
      `if (validator.__validValuesDict[value] === true) return true`
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
    ctx.__validValuesDict = __validValuesDict;
  }
  return ctx;
}
