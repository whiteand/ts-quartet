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
  errorBoundary?: ErrorBoundary;
}

export type FunctionSchema = () => IFunctionSchemaResult;

export interface IObjectSchema extends Record<string, Schema> {
  "__quartet/rest-omit__"?: string[];
}
export interface IVariantSchema extends Array<Schema> {}
export interface IAndSchema extends Array<Schema> {
  0: "__quartet/and__";
}
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
  | IAndSchema
  | IVariantSchema;

export type HandleSchemaHandler<T extends Schema, R> = (schema: T) => R;
export interface IHandleSchemaHandlers<R> {
  constant: HandleSchemaHandler<ConstantSchema, R>;
  function: HandleSchemaHandler<FunctionSchema, R>;
  object: HandleSchemaHandler<IObjectSchema, R>;
  objectRest: HandleSchemaHandler<IObjectSchema, R>;
  variant: HandleSchemaHandler<IVariantSchema, R>;
  and: HandleSchemaHandler<IAndSchema, R>;
}

export interface ITest {
  test: (value: any) => boolean;
}

export type CustomFunction = ((value: any) => boolean) & {
  explanations?: any[];
  pure?: boolean;
};

type IfAny<T, Any, NotAny> = true extends T
  ? ("1" extends T
      ? (1 extends T
          ? ({} extends T
              ? ((() => void) extends T
                  ? (null extends T ? (Any) : (NotAny))
                  : NotAny)
              : NotAny)
          : NotAny)
      : NotAny)
  : NotAny;

export type CompilationResult = ((value: any) => boolean) & IContext;
export type TypedCompilationResult<T> = IfAny<
  T,
  (value: any) => boolean,
  (value: any) => value is T
> &
  IContext;

export interface IMethods {
  and: (this: QuartetInstance, ...schemas: Schema[]) => IAndSchema;
  arrayOf: (this: QuartetInstance, schema: Schema) => FunctionSchema;
  boolean: FunctionSchema;
  compileAnd: <T = any>(
    this: QuartetInstance,
    ...schemas: Schema[]
  ) => TypedCompilationResult<T>;
  compileArrayOf: <T = any>(
    this: QuartetInstance,
    schema: Schema
  ) => TypedCompilationResult<T[]>;
  custom: (
    this: QuartetInstance,
    check: CustomFunction,
    explanation?: any
  ) => FunctionSchema;
  errorBoundary: (
    this: QuartetInstance,
    schema: Schema,
    errorBoundary?: ErrorBoundary
  ) => Schema;
  finite: FunctionSchema;
  function: FunctionSchema;
  max: (
    this: QuartetInstance,
    maxValue: number,
    exclusive?: boolean
  ) => FunctionSchema;
  maxLength: (
    this: QuartetInstance,
    maxLength: number,
    exclusive?: boolean
  ) => FunctionSchema;
  min: (
    this: QuartetInstance,
    minValue: number,
    exclusive?: boolean
  ) => FunctionSchema;
  minLength: (
    this: QuartetInstance,
    minLength: number,
    exclusive?: boolean
  ) => FunctionSchema;
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
export interface IPureCompileConfig {
  ignoreGlobalErrorBoundary: boolean;
}
export type PureCompile = (
  schema: Schema,
  compilationParam?: IPureCompileConfig
) => CompilationResult;
export type ToContext = (
  prefix: string | number,
  value: any,
  isUniq?: boolean
) => [string, Prepare];

interface IInnerMethods {
  pureCompile: PureCompile;
  toContext: ToContext;
  clearContextCounters: () => void;
  settings: ISettings;
}

export interface IErrorBoundaryParams {
  value: any;
  schema: Schema;
  innerExplanations: any[];
  id: string | number;
}
export type ErrorBoundary = (
  explanations: any[],
  params: IErrorBoundaryParams
) => any;

export interface ISettings {
  errorBoundary?: ErrorBoundary;
}

export type QuartetInstance = IMethods &
  IInnerMethods &
  (<T = any>(schema: Schema) => TypedCompilationResult<T>);
