import { AND_SCHEMA_ID } from "./andId";
import { compileArrayOf } from "./compileArrayOf";
import { compileNot } from "./compileNot";
import { getKeyAccessor } from "./getKeyAccessor";
import {
  HandleError,
  IMethods,
  ITest,
  Prepare,
  QuartetInstance,
  Schema,
  TypedCompilationResult
} from "./types";

export const methods: IMethods = {
  and(...schemas: Schema[]) {
    return [AND_SCHEMA_ID, ...schemas];
  },
  arrayOf(schema: Schema) {
    const compiledArr = compileArrayOf(this, schema);
    const [checkArrayId, prepare] = this.toContext("arr", compiledArr);
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
  compileAnd<T>(this: QuartetInstance, ...schemas: Schema[]) {
    return this(this.and(...schemas)) as any;
  },
  compileArrayOf<T>(this: QuartetInstance, schema: Schema) {
    this.clearContextCounters();
    return compileArrayOf(this, schema) as TypedCompilationResult<T[]>;
  },
  custom(
    check: ((value: any) => boolean) & { explanations?: any[]; pure?: boolean },
    explanation?: any
  ) {
    return () => {
      const preparations: Prepare[] = [];
      const [checkId, prepare] = this.toContext("custom", check);
      const checkIdAccessor = getKeyAccessor(checkId);
      preparations.push(prepare);
      let handleError: HandleError | undefined;
      if (explanation !== undefined) {
        const [explanationId, prepareExplanation] = this.toContext(
          "explanation",
          explanation
        );
        const [explanationValue, prepareExplanationValue] = this.toContext(
          "explvalue",
          undefined
        );
        preparations.push(prepareExplanation, prepareExplanationValue);
        const explanationAcc = getKeyAccessor(explanationId);
        const explanationValueAcc = getKeyAccessor(explanationValue);
        handleError =
          typeof explanation === "function"
            ? (id, ctxId) =>
                `${ctxId}${explanationValueAcc} = ${ctxId}${explanationAcc}(${id},${ctxId}${checkIdAccessor}.explanations)\nif (${ctxId}${explanationValueAcc} !== undefined) {\n  ${ctxId}.explanations.push(${ctxId}${explanationValueAcc})\n}`
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
    };
  },
  errorBoundary(schema, errorBoundary) {
    if (!errorBoundary && !this.settings.errorBoundary) {
      return schema;
    }

    errorBoundary = errorBoundary || this.settings.errorBoundary;

    const compiled = this.pureCompile(schema, {
      ignoreGlobalErrorBoundary: true
    });
    const [boundaryId, prepareBoundary] = this.toContext("errorBoundary", {
      handler: errorBoundary,
      schema,
      validator: compiled,
      p: {
        value: null,
        id: null,
        schema: null,
        innerExplanations: []
      }
    });
    const getBoundary = getKeyAccessor(boundaryId);

    return () => ({
      check: (id, ctx) => `${ctx}${getBoundary}.validator(${id})`,
      handleError: (id, ctx) => {
        const b = `${ctx}${getBoundary}`;
        return `${b}.p.id = ${JSON.stringify(id)}\n${b}.p.innerExplanations =  ${b}.validator.explanations\n${b}.p.schema = ${b}.schema\n${b}.p.value=${id}\n${b}.handler(${ctx}.explanations,${b}.p)`;
      },
      not: (id, ctx) => `!${ctx}${getBoundary}.validator(${id})`,
      prepare: prepareBoundary
    });
  },
  finite: () => ({
    check: valueId => `Number.isFinite(${valueId})`,
    not: valueId => `!Number.isFinite(${valueId})`
  }),
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
      ? valueId => `${valueId} != null && ${valueId}.length < ${maxLength}`
      : valueId => `${valueId} != null && ${valueId}.length <= ${maxLength}`,
    not: exclusive
      ? valueId => `${valueId} == null || ${valueId}.length >= ${maxLength}`
      : valueId => `${valueId} == null || ${valueId}.length > ${maxLength}`
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
      ? valueId => `${valueId} != null && ${valueId}.length > ${maxLength}`
      : valueId => `${valueId} != null && ${valueId}.length >= ${maxLength}`,
    not: exclusive
      ? valueId => `${valueId} == null || ${valueId}.length <= ${maxLength}`
      : valueId => `${valueId} == null || ${valueId}.length < ${maxLength}`
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
    return compileNot(this, schema);
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
  test(tester: ITest) {
    return () => {
      const [testId, prepare] = this.toContext("tester", tester);
      const testerAcc = getKeyAccessor(testId);
      return {
        check: (id, ctx) => `${ctx}${testerAcc}.test(${id})`,
        not: (id, ctx) => `!${ctx}${testerAcc}.test(${id})`,
        prepare
      };
    };
  }
};
