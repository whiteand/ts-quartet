type QuartetSettings = {
  allErrors?: boolean;
};
type Context = {
  explanations: any[];
  [key: string]: any;
};
type Prepare = (ctx: Context) => void;
type HandleError = (valueId: string, ctxId: string) => string;
type FunctionSchemaResult = {
  prepare?: Prepare;
  check: (valueId: string, ctxId: string) => string;
  handleError?: HandleError;
  not?: (valudId: string, ctxId: string) => string;
};

export type FunctionSchema = () => FunctionSchemaResult;
interface IObjectSchema {
  [key: string]: Schema;
}
interface IVariantSchema extends Array<Schema> {}
type ConstantSchema = undefined | null | boolean | number | string | symbol;
type Schema = FunctionSchema | ConstantSchema | IObjectSchema | IVariantSchema;

type HandleSchemaHandler<T extends Schema, R> = (schema: T) => R;
interface HandleSchemaHandlers<R> {
  function: HandleSchemaHandler<FunctionSchema, R>;
  constant: HandleSchemaHandler<ConstantSchema, R>;
  objectRest: HandleSchemaHandler<IObjectSchema, R>;
  object: HandleSchemaHandler<IObjectSchema, R>;
  variant: HandleSchemaHandler<IVariantSchema, R>;
}

const EMPTY: any = {};
function has(obj: any, key: any) {
  if (!obj) return false;
  if (EMPTY[key] !== undefined) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  return obj[key] !== undefined || key in obj;
}
function handleSchema<R>(
  handlers: HandleSchemaHandlers<R>
): (schema: Schema) => R {
  return schema => {
    if (typeof schema === "function") {
      return handlers.function(schema);
    }
    if (!schema || typeof schema !== "object") {
      return handlers.constant(schema);
    }
    if (Array.isArray(schema)) {
      return handlers.variant(schema);
    }
    if (has(schema, v.rest)) {
      return handlers.objectRest(schema);
    } else {
      return handlers.object(schema);
    }
  };
}
function compileFunctionSchemaResult(s: FunctionSchemaResult) {
  let code = `() => true`;

  if (s.handleError) {
    code = `(() => {
      function validator(value) {
        validator.explanations = []
        if (${s.check("value", "validator")}) {
          return true
        }
        ${s.handleError("value", "validator")}
        return false
      }
      return validator
    })()`;
  } else {
    code = `(() => {
        function validator(value) {
          validator.explanations = []
          return ${s.check("value", "validator")}
        }
        return validator
      })()`;
  }
  const ctx = eval(code);
  ctx.explanations = [];
  if (s.prepare) {
    s.prepare(ctx);
  }
  return ctx;
}

function compileConstant(c: ConstantSchema) {
  return Object.assign((value: any) => value === c, { explanations: [] });
}

let variantObjectCounter = 0;
function compileSingleVariantToReturnWay(
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  handleErrors: HandleError[],
  stringNumbersSymbols: (string | number | symbol)[]
): string {
  return handleSchema({
    function: schema => {
      const s = schema();

      if (s.prepare) {
        preparations.push(s.prepare);
      }
      if (s.handleError) {
        handleErrors.push(s.handleError);
      }
      return `if (${s.check(valueId, ctxId)}) return true;`;
    },
    constant: schema => {
      if (schema === null) {
        return `if (${valueId} === null) return true`;
      }
      if (schema === undefined) {
        return `if (${valueId} === undefined) return true`;
      }
      if (
        typeof schema === "symbol" ||
        typeof schema === "string" ||
        typeof schema === "number"
      ) {
        stringNumbersSymbols.push(schema);
        return "";
      }
      return `if (${valueId} === ${JSON.stringify(schema)}) return true`;
    },
    variant: schema => {
      const res = [];
      for (let variant of schema) {
        res.push(
          compileSingleVariantToReturnWay(
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
    },
    object: schema => {
      const compiled = compileObjectSchema(schema);
      const id = `object-in-variant-${variantObjectCounter++}`;
      preparations.push(ctx => {
        ctx[id] = compiled;
        Object.assign(ctx, compiled);
      });
      return compileSingleVariantToReturnWay(
        valueId,
        ctxId,
        () => ({
          check: (valueId, ctxId) => `${ctxId}['${id}'](${valueId})`,
          not: (valueId, ctxId) => `!${ctxId}['${id}'](${valueId})`,
          handleError: () =>
            `${ctxId}.explanations.push(...${ctxId}['${id}'].explanations)`
        }),
        preparations,
        handleErrors,
        stringNumbersSymbols
      );
    },
    objectRest: schema => {
      const compiled = compileObjectSchemaWithRest(schema);
      const id = `object-rest-in-variant-${variantObjectCounter++}`;
      preparations.push(ctx => {
        ctx[id] = compiled;
        Object.assign(ctx, compiled);
      });
      return compileSingleVariantToReturnWay(
        valueId,
        ctxId,
        () => ({
          check: (valueId, ctxId) => `${ctxId}['${id}'](${valueId})`,
          not: (valueId, ctxId) => `!${ctxId}['${id}'](${valueId})`,
          handleError: () =>
            `${ctxId}.explanations.push(...${ctxId}['${id}'].explanations)`
        }),
        preparations,
        handleErrors,
        stringNumbersSymbols
      );
    }
  })(schema);
}

function compileVariants(variants: IVariantSchema) {
  const preparations: Prepare[] = [];
  const handleErrors: HandleError[] = [];
  const stringNumbersSymbols: (string | number | symbol)[] = [];
  const bodyCode = [];
  for (const variant of variants) {
    bodyCode.push(
      compileSingleVariantToReturnWay(
        `value`,
        `validator`,
        variant,
        preparations,
        handleErrors,
        stringNumbersSymbols
      )
    );
  }
  let validValuesDict = {};
  if (stringNumbersSymbols.length > 0) {
    validValuesDict = stringNumbersSymbols.reduce((dict: any, el) => {
      dict[el] = true;
      return dict;
    }, {});
    bodyCode.unshift(
      `if (validator.validValuesDict[value] === true) return true`
    );
  }
  if (handleErrors.length > 0) {
    bodyCode.push(
      ...handleErrors.map(handleError => handleError("value", "validator"))
    );
  }
  const ctx = eval(`(() => {
    function validator(value) {

      ${bodyCode
        .filter(Boolean)
        .map(e => e.trim())
        .join("\n")}
      return false
    }
    return validator
  })()`);
  for (const prepare of preparations) {
    prepare(ctx);
  }
  if (stringNumbersSymbols.length > 0) {
    ctx.validValuesDict = validValuesDict;
  }
  return ctx;
}

interface IMethods {
  string: FunctionSchema;
  number: FunctionSchema;
  safeInteger: FunctionSchema;
  rest: string;
}
export const v: IMethods = {
  string: () => ({
    check: valueId => `typeof ${valueId} === 'string'`,
    not: valueId => `typeof ${valueId} !== 'string'`
  }),
  number: () => ({
    check: valueId => `typeof ${valueId} === 'number'`,
    not: valueId => `typeof ${valueId} !== 'number'`
  }),
  safeInteger: () => ({
    check: valueId => `Number.isSafeInteger(${valueId})`,
    not: valueId => `!Number.isSafeInteger(${valueId})`
  }),
  rest: "__quartet/rest__"
};
function compileAndReturnWay(
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  stringNumbersSymbols: (string | number | symbol)[]
): string {
  return handleSchema({
    function: schema => {
      const s = schema();
      if (s.prepare) {
        preparations.push(s.prepare);
      }
      const notCheck = s.not
        ? s.not(valueId, ctxId)
        : `!(${s.check(valueId, ctxId)})`;
      return s.handleError
        ? `
          if (${notCheck}) {
            ${s.handleError}
            return false
          }
        `
        : `if (${notCheck}) return false`;
    },
    constant: schema => {
      if (schema === null) {
        return `if (${valueId} !== null) return false`;
      }
      if (schema === undefined) {
        return `if (${valueId} !== undefined) return false`;
      }
      if (
        typeof schema === "symbol" ||
        typeof schema === "string" ||
        typeof schema === "number"
      ) {
        stringNumbersSymbols.push(schema);
        return "";
      }
      return `if (${valueId} !== ${JSON.stringify(schema)}) return false`;
    },
    objectRest: schema => {
      // TODO: Implement
      return "";
    },
    object: schema => {
      // TODO: Implement
      return "";
    },
    variant: schema => {
      // TODO: Implement
      return "";
    }
  })(schema);
}
function getKeyAccessor(key: string) {
  return /^[a-zA-Z0-9_]+$/.test(key) ? "." + key : `[${JSON.stringify(key)}]`;
}
function compileObjectSchema(s: IObjectSchema) {
  const keys = Object.keys(s);
  const bodyCode = [];
  const preparations: Prepare[] = [];
  const ctxId = "validator";
  const validValues: Record<string, Record<string, true>> = {};
  const withValidValues: string[] = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const schema = s[key];
    const keyAccessor = getKeyAccessor(key);
    const valueId = `value${keyAccessor}`;
    const keyValidValues: any[] = [];
    bodyCode.push(
      compileAndReturnWay(valueId, ctxId, schema, preparations, keyValidValues)
    );
    if (keyValidValues.length > 0) {
      withValidValues.push(key);
      if (!validValues[key]) {
        validValues[key] = {};
      }
      for (const valid of keyValidValues) {
        validValues[key][valid] = true;
      }
    }
  }

  if (withValidValues) {
    preparations.push(ctx => {
      ctx.__validValues = validValues;
    });
    bodyCode.unshift(
      ...withValidValues.map(key => {
        const keyAccessor = getKeyAccessor(key);
        return `
        if (!validator.__validValues${keyAccessor}[value${keyAccessor}]) return false
      `;
      })
    );
  }
  bodyCode.unshift("if (!value) return false", "validator.explanations = []");

  const ctx = eval(`
    (() => {
      function validator(value) {
        ${bodyCode
          .map(e => e.trim())
          .filter(Boolean)
          .join("\n")}

        return true
      }
      return validator
    })()
  `);

  for (const prepare of preparations) {
    prepare(ctx);
  }

  ctx.explanations = [];

  return ctx;
}
function compileObjectSchemaWithRest(s: IObjectSchema) {
  // TODO: handle
  return Object.assign(() => true, { explanations: [] });
}

type TypedCompilationResult<T> = ((value: any) => value is T) & Context;
type CompilationResult = ((value: any) => boolean) & Context;
export function c<T>(s: Schema): TypedCompilationResult<T>;
export function c(s: Schema): CompilationResult {
  const compiled = handleSchema<CompilationResult>({
    function: s => compileFunctionSchemaResult(s()),
    constant: s => compileConstant(s),
    variant: s => compileVariants(s),
    objectRest: s => compileObjectSchemaWithRest(s),
    object: s => compileObjectSchema(s)
  })(s);

  return compiled as any;
}
