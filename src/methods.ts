import { compileAnd } from "./compileAnd";
import { arrayOf } from "./compileArrayOf";
import { compileNot } from "./compileNot";
import { toContext } from "./toContext";
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
    return this.custom(compileAnd(this as any, schemas));
  },
  arrayOf(schema: Schema) {
    return this.custom(arrayOf(this as any, schema));
  },
  bigint: () => ({
    check: valueId => `typeof ${valueId} === 'bigint'`,
    not: valueId => `typeof ${valueId} !== 'bigint'`
  }),
  boolean: () => ({
    check: valueId => `typeof ${valueId} === 'boolean'`,
    not: valueId => `typeof ${valueId} !== 'boolean'`
  }),
  compileAnd<T>(...schemas: Schema[]) {
    return compileAnd(this as any, schemas) as TypedCompilationResult<T>;
  },
  compileArrayOf<T>(schema: Schema) {
    return arrayOf(this as any, schema) as TypedCompilationResult<T[]>;
  },
  custom: (check: (value: any) => boolean, explanation?: any) => () => {
    const preparations: Prepare[] = [];
    const [checkId, prepare] = toContext("custom", check);
    preparations.push(prepare);
    let handleError: HandleError | undefined;
    const [explanationId, prepareExplanation] = toContext(
      "explanation",
      explanation
    );
    if (explanation !== undefined) {
      preparations.push(prepareExplanation);
      handleError =
        typeof explanation === "function"
          ? (id, ctxId) =>
              `${ctxId}['${explanationId}-value'] = ${ctxId}['${explanationId}'](${id})\nif (${ctxId}['${explanationId}-value'] !== undefined) {\n  ${ctxId}.explanations.push(${ctxId}['${explanationId}-value'])\n}`
          : (id, ctxId) =>
              `${ctxId}.explanations.push(${ctxId}['${explanationId}'])`;
    }
    return {
      check: (id: any, ctx: any) => `${ctx}['${checkId}'](${id})`,
      handleError,
      not: (id: any, ctx: any) => `!${ctx}['${checkId}'](${id})`,
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
    return {
      check: (id, ctx) => `${ctx}['${testId}'].test(${id})`,
      not: (id, ctx) => `!${ctx}['${testId}'].test(${id})`,
      prepare
    };
  }
};
