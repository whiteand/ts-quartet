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
  and: (...schemas: Schema[]) => FunctionSchema;
  arrayOf: (schema: Schema) => FunctionSchema;
  bigint: FunctionSchema;
  boolean: FunctionSchema;
  compileAnd: (<T = any>(...schemas: Schema[]) => TypedCompilationResult<T>) &
    ((...schemas: Schema[]) => CompilationResult);
  compileArrayOf: (<T = any>(schema: Schema) => TypedCompilationResult<T[]>) &
    ((schema: Schema) => CompilationResult);
  custom: (check: CustomFunction, explanation?: any) => FunctionSchema;
  function: FunctionSchema;
  max: (maxValue: number, exclusive?: boolean) => FunctionSchema;
  maxLength: (maxLength: number, exclusive?: boolean) => FunctionSchema;
  min: (minValue: number, exclusive?: boolean) => FunctionSchema;
  minLength: (minLength: number, exclusive?: boolean) => FunctionSchema;
  negative: FunctionSchema;
  number: FunctionSchema;
  not: (schema: Schema) => FunctionSchema;
  positive: FunctionSchema;
  rest: string;
  safeInteger: FunctionSchema;
  string: FunctionSchema;
  symbol: FunctionSchema;
  test: (test: ITest) => FunctionSchema;
}

export type QuartetInstance = IMethods &
  (<T>(schema: Schema) => TypedCompilationResult<T>) &
  ((schema: Schema) => CompilationResult);
