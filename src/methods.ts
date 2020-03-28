import { compileAnd } from "./compileAnd";
import { compileArrayOf } from "./compileArrayOf";
import { compileNot } from "./compileNot";
import { getKeyAccessor } from "./getKeyAccessor";
import { clearContextCounters, toContext } from "./toContext";
import {
  HandleError,
  IMethods,
  ITest,
  Prepare,
  Schema,
  TypedCompilationResult
} from "./types";

export const methods: IMethods = {
  and(...schemas: Schema[]) {
    const compiledAnd = compileAnd(this as any, schemas);

    const [checkAndId, prepare] = toContext("and", compiledAnd);
    const checkAnd = getKeyAccessor(checkAndId);
    return compiledAnd.pure
      ? () => ({
          check: (id, ctx) => `${ctx}${checkAnd}(${id})`,
          not: (id, ctx) => `!${ctx}${checkAnd}(${id})`,
          prepare
        })
      : () => ({
          check: (id, ctx) => `${ctx}${checkAnd}(${id})`,
          handleError: (id, ctx) =>
            `${ctx}.explanations.push(...${ctx}${checkAnd}.explanations)`,
          not: (id, ctx) => `!${ctx}${checkAnd}(${id})`,
          prepare
        });
  },
  arrayOf(schema: Schema) {
    const compiledArr = compileArrayOf(this as any, schema);
    const [checkArrayId, prepare] = toContext("arr", compiledArr);
    const checkArray = getKeyAccessor(checkArrayId);
    return compiledArr.pure
      ? () => ({
          check: (id, ctx) => `${ctx}${checkArray}(${id})`,
          not: (id, ctx) => `!${ctx}${checkArray}(${id})`,
          prepare
        })
      : () => ({
          check: (id, ctx) => `${ctx}${checkArray}(${id})`,
          handleError: (id, ctx) =>
            `${ctx}.explanations.push(...${ctx}${checkArray}.explanations)`,
          not: (id, ctx) => `!${ctx}${checkArray}(${id})`,
          prepare
        });
  },
  boolean: () => ({
    check: valueId => `typeof ${valueId} === 'boolean'`,
    not: valueId => `typeof ${valueId} !== 'boolean'`
  }),
  compileAnd<T>(...schemas: Schema[]) {
    clearContextCounters();
    return compileAnd(this as any, schemas) as TypedCompilationResult<T>;
  },
  compileArrayOf<T>(schema: Schema) {
    clearContextCounters();
    return compileArrayOf(this as any, schema) as TypedCompilationResult<T[]>;
  },
  custom: (
    check: ((value: any) => boolean) & { explanations?: any[]; pure?: boolean },
    explanation?: any
  ) => () => {
    const preparations: Prepare[] = [];
    const [checkId, prepare] = toContext("custom", check);
    const checkIdAccessor = getKeyAccessor(checkId);
    preparations.push(prepare);
    let handleError: HandleError | undefined;
    if (explanation !== undefined) {
      const [explanationId, prepareExplanation] = toContext(
        "explanation",
        explanation
      );
      const [explanationValue, prepareExplanationValue] = toContext(
        "explvalue",
        undefined
      );
      preparations.push(prepareExplanation, prepareExplanationValue);
      const explanationAcc = getKeyAccessor(explanationId);
      const explanationValueAcc = getKeyAccessor(explanationValue);
      handleError =
        typeof explanation === "function"
          ? (id, ctxId) =>
              `${ctxId}${explanationValueAcc} = ${ctxId}${explanationAcc}(${id})\nif (${ctxId}${explanationValueAcc} !== undefined) {\n  ${ctxId}.explanations.push(${ctxId}${explanationValueAcc})\n}`
          : (id, ctxId) =>
              `${ctxId}.explanations.push(${ctxId}${explanationAcc})`;
    } else if (Array.isArray(check.explanations) && !check.pure) {
      handleError = (id, ctxId) =>
        `${ctxId}.explanations.push(...${ctxId}${checkIdAccessor}.explanations)`;
    }
    return {
      check: (id: any, ctx: any) => `${ctx}${checkIdAccessor}(${id})`,
      handleError,
      not: (id: any, ctx: any) => `!${ctx}${checkIdAccessor}(${id})`,
      prepare: ctx => {
        for (const partialPrepare of preparations) {
          partialPrepare(ctx);
        }
      }
    };
  },
  function: () => ({
    check: valueId => `typeof ${valueId} === 'function'`,
    not: valueId => `typeof ${valueId} !== 'function'`
  }),
  max: (maxValue: number, exclusive: boolean = false) => () => ({
    check: exclusive
      ? valueId => `${valueId} < ${maxValue}`
      : valueId => `${valueId} <= ${maxValue}`,
    not: exclusive
      ? valueId => `${valueId} >= ${maxValue}`
      : valueId => `${valueId} > ${maxValue}`
  }),
  maxLength: (maxLength: number, exclusive: boolean = false) => () => ({
    check: exclusive
      ? valueId => `${valueId} && ${valueId}.length < ${maxLength}`
      : valueId => `${valueId} && ${valueId}.length <= ${maxLength}`,
    not: exclusive
      ? valueId => `!${valueId} || ${valueId}.length >= ${maxLength}`
      : valueId => `!${valueId} || ${valueId}.length > ${maxLength}`
  }),
  min: (minValue: number, exclusive: boolean = false) => () => ({
    check: exclusive
      ? valueId => `${valueId} > ${minValue}`
      : valueId => `${valueId} >= ${minValue}`,
    not: exclusive
      ? valueId => `${valueId} <= ${minValue}`
      : valueId => `${valueId} < ${minValue}`
  }),
  minLength: (maxLength: number, exclusive: boolean = false) => () => ({
    check: exclusive
      ? valueId => `${valueId} && ${valueId}.length > ${maxLength}`
      : valueId => `${valueId} && ${valueId}.length >= ${maxLength}`,
    not: exclusive
      ? valueId => `!${valueId} || ${valueId}.length <= ${maxLength}`
      : valueId => `!${valueId} || ${valueId}.length < ${maxLength}`
  }),
  negative: () => ({
    check: valueId => `${valueId} < 0`,
    not: valueId => `${valueId} >= 0`
  }),
  number: () => ({
    check: valueId => `typeof ${valueId} === 'number'`,
    not: valueId => `typeof ${valueId} !== 'number'`
  }),
  not(schema) {
    return compileNot(this as any, schema);
  },
  positive: () => ({
    check: valueId => `${valueId} > 0`,
    not: valueId => `${valueId} <= 0`
  }),
  rest: "__quartet/rest__",
  restOmit: "__quartet/rest-omit__",
  safeInteger: () => ({
    check: valueId => `Number.isSafeInteger(${valueId})`,
    not: valueId => `!Number.isSafeInteger(${valueId})`
  }),
  string: () => ({
    check: valueId => `typeof ${valueId} === 'string'`,
    not: valueId => `typeof ${valueId} !== 'string'`
  }),
  symbol: () => ({
    check: valueId => `typeof ${valueId} === 'symbol'`,
    not: valueId => `typeof ${valueId} !== 'symbol'`
  }),
  test: (tester: ITest) => () => {
    const [testId, prepare] = toContext("tester", tester);
    const testerAcc = getKeyAccessor(testId);
    return {
      check: (id, ctx) => `${ctx}${testerAcc}.test(${id})`,
      not: (id, ctx) => `!${ctx}${testerAcc}.test(${id})`,
      prepare
    };
  }
};
