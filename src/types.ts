export interface IContext {
  explanations: any[];
  pure: boolean;
  [key: string]: any;
}
export type Prepare = (ctx: IContext) => void;
export type HandleError = (valueId: string, ctxId: string) => string;
export interface IFunctionSchemaResult {
  prepare?: Prepare;
  check: (valueId: string, ctxId: string) => string;
  handleError?: HandleError;
  not?: (valudId: string, ctxId: string) => string;
}

export type FunctionSchema = () => IFunctionSchemaResult;

export interface IObjectSchema {
  "__quartet/rest-omit__"?: string[];
  [key: string]: Schema;
}
export interface IVariantSchema extends Array<Schema> {}
export type ConstantSchema =
  | undefined
  | null
  | boolean
  | number
  | string
  | symbol;
export type Schema =
  | FunctionSchema
  | ConstantSchema
  | IObjectSchema
  | IVariantSchema;

export type HandleSchemaHandler<T extends Schema, R> = (schema: T) => R;
export interface IHandleSchemaHandlers<R> {
  constant: HandleSchemaHandler<ConstantSchema, R>;
  function: HandleSchemaHandler<FunctionSchema, R>;
  object: HandleSchemaHandler<IObjectSchema, R>;
  objectRest: HandleSchemaHandler<IObjectSchema, R>;
  variant: HandleSchemaHandler<IVariantSchema, R>;
}

export interface ITest {
  test: (value: any) => boolean;
}

export type CustomFunction = ((value: any) => boolean) & {
  explanations?: any[];
  pure?: boolean;
};

export type CompilationResult = ((value: any) => boolean) & IContext;
export type TypedCompilationResult<T> = ((value: any) => value is T) & IContext;

export interface IMethods {
  and: (this: QuartetInstance, ...schemas: Schema[]) => FunctionSchema;
  arrayOf: (this: QuartetInstance, schema: Schema) => FunctionSchema;
  boolean: FunctionSchema;
  compileAnd: (<T = any>(this: QuartetInstance, ...schemas: Schema[]) => TypedCompilationResult<T>) &
    ((this: QuartetInstance, ...schemas: Schema[]) => CompilationResult);
  compileArrayOf: (<T = any>(this: QuartetInstance, schema: Schema) => TypedCompilationResult<T[]>) &
    ((this: QuartetInstance, schema: Schema) => CompilationResult);
  custom: (this: QuartetInstance, check: CustomFunction, explanation?: any) => FunctionSchema;
  finite: FunctionSchema;
  function: FunctionSchema;
  max: (this: QuartetInstance, maxValue: number, exclusive?: boolean) => FunctionSchema;
  maxLength: (this: QuartetInstance, maxLength: number, exclusive?: boolean) => FunctionSchema;
  min: (this: QuartetInstance, minValue: number, exclusive?: boolean) => FunctionSchema;
  minLength: (this: QuartetInstance, minLength: number, exclusive?: boolean) => FunctionSchema;
  negative: FunctionSchema;
  not: (this: QuartetInstance, schema: Schema) => FunctionSchema;
  number: FunctionSchema;
  positive: FunctionSchema;
  rest: "__quartet/rest__";
  restOmit: "__quartet/rest-omit__";
  safeInteger: FunctionSchema;
  string: FunctionSchema;
  symbol: FunctionSchema;
  test: (this: QuartetInstance, test: ITest) => FunctionSchema;
}

export type PureCompile = (schema: Schema) => CompilationResult
export type ToContext = (prefix: string | number, value: any, isUniq?: boolean) => [string, Prepare]

interface IInnerMethods {
  pureCompile: PureCompile
  toContext: ToContext
  clearContextCounters: () => void
}

export type QuartetInstance = IMethods & IInnerMethods &
  (<T>(schema: Schema) => TypedCompilationResult<T>) &
  ((schema: Schema) => CompilationResult);
