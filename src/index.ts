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
function compileFunctionSchemaResult(s: FunctionSchemaResult) {
  let code = `() => true`;

  if (s.handleError) {
    code = `(() => {
      function validator(value) {
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

function compileSingleVariantToReturnWay(
  valueId: string,
  ctxId: string,
  schema: Schema,
  preparations: Prepare[],
  handleErrors: HandleError[],
  stringNumbersSymbols: (string | number | symbol)[]
): string {
  if (typeof schema === "function") {
    const s = schema();

    if (s.prepare) {
      preparations.push(s.prepare);
    }
    if (s.handleError) {
      handleErrors.push(s.handleError);
    }
    return `if (${s.check(valueId, ctxId)}) return true;`;
  }
  if (!schema || typeof schema !== "object") {
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
  }
  if (Array.isArray(schema)) {
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
  }
  // TODO: Implement Objects
  return "";
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

const EMPTY: any = {};
function has(obj: any, key: any) {
  if (!obj) return false;
  if (EMPTY[key] !== undefined) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
  return obj[key] !== undefined || key in obj;
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

type TypedCompilationResult<T> = ((value: any) => value is T) & Context;
type CompilationResult = ((value: any) => boolean) & Context;
export function c<T>(s: Schema): TypedCompilationResult<T>;
export function c(s: Schema): CompilationResult {
  if (typeof s === "function") {
    return compileFunctionSchemaResult(s());
  }
  if (!s || typeof s !== "object") {
    return compileConstant(s);
  }
  if (Array.isArray(s)) {
    return compileVariants(s);
  }
  if (has(s, v.rest)) {
    // TODO: Compile Object validation
  } else {
    // TODO: Compile Object validation without rest
  }

  return Object.assign(() => true, { explanations: [] });
}
