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
  TypedCompilationResult,
  IObjectSchema
} from "./types";
import { handleSchema } from "./handleSchema";
import { constantToFunc } from "./constantToFunc";

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
    const defaultHandler = (schema: Schema): Schema => {
      const compiled = this.pureCompile(schema, {
        ignoreGlobalErrorBoundary: true
      });
      const [boundaryId, prepareBoundary] = this.toContext("errorBoundary", {
        handler: errorBoundary,
        p: {
          id: null,
          innerExplanations: [],
          schema,
          value: null
        },
        validator: compiled
      });
      const getBoundary = getKeyAccessor(boundaryId);

      return () => ({
        check: (id, ctx) => `${ctx}${getBoundary}.validator(${id})`,
        handleError: (id, ctx) => {
          const b = `${ctx}${getBoundary}`;
          return `${b}.p.id = ${JSON.stringify(
            id
          )}\n${b}.p.innerExplanations = ${b}.validator.explanations\n${b}.p.value=${id}\n${b}.handler(${ctx}.explanations,${b}.p)`;
        },
        not: (id, ctx) => `!${ctx}${getBoundary}.validator(${id})`,
        prepare: prepareBoundary,
        errorBoundary,
      });
    };

    return handleSchema({
      and: andSchema => {
        const errorBoundedSchemas: Schema[] = [];
        for (let i = 1; i < andSchema.length; i++) {
          const newSchema = this.errorBoundary(andSchema[i], errorBoundary);
          errorBoundedSchemas.push(newSchema);
        }
        return [AND_SCHEMA_ID, ...errorBoundedSchemas];
      },
      constant: constant => {
        const res = constantToFunc(this, constant)();
        const [boundaryId, prepareBoundary] = this.toContext("errorBoundary", {
          handler: errorBoundary,
          p: {
            id: null,
            schema: constant,
            value: null,
            innerExplanations: [],
            exps: []
          }
        });
        const getBoundary = getKeyAccessor(boundaryId);

        return () => ({
          check: res.check,
          handleError: (id, ctx) => {
            const b = ctx + getBoundary;
            return `${b}.p.id = ${JSON.stringify(
              id
            )}\n${b}.p.value=${id}\n${b}.p.exps=[]\n${b}.handler(${b}.p.exps,${b}.p)\n${ctx}.explanations = ${b}.p.exps`;
          },
          not: res.not,
          prepare: ctx => {
            if (res.prepare) {
              res.prepare(ctx);
            }
            prepareBoundary(ctx);
          },
          errorBoundary,
        });
      },
      function: funcSchema => {
        const res = funcSchema();
        if (res.errorBoundary === errorBoundary) return funcSchema
        const [boundaryId, prepareBoundary] = this.toContext("errorBoundary", {
          handler: errorBoundary,
          p: {
            id: null,
            schema: funcSchema,
            value: null,
            innerExplanations: []
          },
          exps: []
        });
        const getBoundary = getKeyAccessor(boundaryId);

        return () => ({
          check: res.check,
          handleError: (id, ctx) => {
            const b = ctx + getBoundary;
            const errorBoundaryHandling = `${b}.p.id = ${JSON.stringify(
              id
            )}\n${b}.p.innerExplanations = ${ctx}.explanations\n${b}.p.value=${id}\n${b}.exps=[]\n${b}.handler(${b}.exps,${b}.p)\n${ctx}.explanations = ${b}.exps`;
            return res.handleError
              ? res.handleError(id, ctx) + "\n" + errorBoundaryHandling
              : errorBoundaryHandling;
          },
          not: res.not,
          prepare: ctx => {
            if (res.prepare) {
              res.prepare(ctx);
            }
            prepareBoundary(ctx);
          },
          errorBoundary,
        });
      },
      object: objectSchema => {
        let res: IObjectSchema = {};
        const entries = Object.entries(objectSchema);
        for (let i = 0; i < entries.length; i++) {
          const [key, schema] = entries[i];
          const boundedSchema = this.errorBoundary(schema, errorBoundary);
          res[key] = boundedSchema;
        }
        return res;
      },
      objectRest: objectSchema => {
        let res: IObjectSchema = {};
        const entries = Object.entries(objectSchema);
        for (let i = 0; i < entries.length; i++) {
          const [key, schema] = entries[i];
          if (key === this.restOmit) {
            res[key] = objectSchema[this.restOmit];
            continue;
          }
          const boundedSchema = this.errorBoundary(schema, errorBoundary);
          res[key] = boundedSchema;
        }
        return res;
      },
      variant: defaultHandler
    })(schema);
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
