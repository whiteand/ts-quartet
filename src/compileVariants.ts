import { beautify } from "./beautify";
import { compileObjectSchema } from "./compileObjectSchema";
import { compileObjectSchemaWithRest } from "./compileObjectSchemaWithRest";
import { handleSchema } from "./handleSchema";
import { toContext } from "./toContext";
import {
  CompilationResult,
  HandleError,
  IVariantSchema,
  Prepare,
  Schema
} from "./types";

function compileVariantElementToReturnWay(
  c: (schema: Schema) => CompilationResult,
  index: number,
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  handleErrors: HandleError[],
  stringNumbersSymbols: Array<string | number | symbol>
): string {
  return handleSchema({
    constant: constant => {
      if (constant === null) {
        return `if (${valueId} === null) return true`;
      }
      if (constant === undefined) {
        return `if (${valueId} === undefined) return true`;
      }
      if (constant === "false" || constant === "true") {
        return `if (${valueId} === ${JSON.stringify(constant)}) return true`;
      }
      if (typeof constant === "number") {
        if (Number.isNaN(constant)) {
          return `if (Number.isNaN(${valueId})) return true`;
        }
        return `if (${valueId} === ${constant}) return true`;
      }
      if (typeof constant === "symbol" || typeof constant === "string") {
        stringNumbersSymbols.push(constant);
        return "";
      }
      return `if (${valueId} === ${JSON.stringify(constant)}) return true`;
    },
    function: funcSchema => {
      const s = funcSchema();

      if (s.prepare) {
        preparations.push(s.prepare);
      }
      if (s.handleError) {
        handleErrors.push(s.handleError);
      }
      return `if (${s.check(valueId, ctxId)}) return true;`;
    },
    object: objectSchema => {
      const compiled = compileObjectSchema(c, objectSchema);
      const [id, prepare] = toContext("variant-" + index, compiled);
      preparations.push(prepare);
      return compileVariantElementToReturnWay(
        c,
        index,
        valueId,
        ctxId,
        () => ({
          check: () => `${ctxId}['${id}'](${valueId})`,
          handleError: () =>
            `${ctxId}.explanations.push(...${ctxId}['${id}'].explanations)`,
          not: () => `!${ctxId}['${id}'](${valueId})`
        }),
        preparations,
        handleErrors,
        stringNumbersSymbols
      );
    },
    objectRest: objectSchema => {
      const compiled = compileObjectSchemaWithRest(c, objectSchema);
      const [id, prepare] = toContext("variant-" + index, compiled);
      preparations.push(prepare);
      return compileVariantElementToReturnWay(
        c,
        index,
        valueId,
        ctxId,
        () => ({
          check: () => `${ctxId}['${id}'](${valueId})`,
          handleError: () =>
            `${ctxId}.explanations.push(...${ctxId}['${id}'].explanations)`,
          not: () => `!${ctxId}['${id}'](${valueId})`
        }),
        preparations,
        handleErrors,
        stringNumbersSymbols
      );
    },
    variant: schemas => {
      const res = [];
      for (const variant of schemas) {
        res.push(
          compileVariantElementToReturnWay(
            c,
            index,
            valueId,
            ctxId,
            variant,
            preparations,
            handleErrors,
            stringNumbersSymbols
          )
        );
      }
      return res.join("\n");
    }
  })(schema);
}

export function compileVariants(
  c: (schema: Schema) => CompilationResult,
  variants: IVariantSchema
) {
  if (variants.length === 0) {
    return Object.assign(() => false, { explanations: [] });
  }
  if (variants.length === 1) {
    return c(variants[0]);
  }
  const preparations: Prepare[] = [];
  const handleErrors: HandleError[] = [];
  const stringNumbersSymbols: Array<string | number | symbol> = [];
  const bodyCode = [];
  for (let i = 0; i < variants.length; i++) {
    const variant = variants[i];
    bodyCode.push(
      compileVariantElementToReturnWay(
        c,
        i,
        `value`,
        `validator`,
        variant,
        preparations,
        handleErrors,
        stringNumbersSymbols
      )
    );
  }
  // tslint:disable-next-line
  let __validValuesDict = {};
  if (stringNumbersSymbols.length > 0) {
    __validValuesDict = stringNumbersSymbols.reduce((dict: any, el) => {
      dict[el] = true;
      return dict;
    }, {});
    bodyCode.unshift(
      `if (validator.__validValuesDict[value] === true) return true`
    );
  }
  if (handleErrors.length > 0) {
    bodyCode.push(
      ...handleErrors.map(handleError => handleError("value", "validator"))
    );
  }
  // tslint:disable-next-line
  const ctx = eval(
    beautify(`(() => {
      function validator(value) {
  
        ${bodyCode
          .map(e => e.trim())
          .filter(Boolean)
          .join("\n")}
        return false
      }
      return validator
    })()`)
  );
  for (const prepare of preparations) {
    prepare(ctx);
  }
  ctx.explanations = [];
  if (stringNumbersSymbols.length > 0) {
    ctx.__validValuesDict = __validValuesDict;
  }
  return ctx;
}
