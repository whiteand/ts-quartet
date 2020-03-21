export interface IContext {
  explanations: any[];
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

type HandleSchemaHandler<T extends Schema, R> = (schema: T) => R;
export interface IHandleSchemaHandlers<R> {
  constant: HandleSchemaHandler<ConstantSchema, R>;
  function: HandleSchemaHandler<FunctionSchema, R>;
  object: HandleSchemaHandler<IObjectSchema, R>;
  objectRest: HandleSchemaHandler<IObjectSchema, R>;
  variant: HandleSchemaHandler<IVariantSchema, R>;
}

export interface IMethods {
  bigint: FunctionSchema;
  boolean: FunctionSchema;
  function: FunctionSchema;
  negative: FunctionSchema;
  number: FunctionSchema;
  positive: FunctionSchema;
  rest: string;
  safeInteger: FunctionSchema;
  string: FunctionSchema;
  symbol: FunctionSchema;
}

type TypedCompilationResult<T> = ((value: any) => value is T) & IContext;
export type CompilationResult = ((value: any) => boolean) & IContext;
export type QuartetInstance = IMethods &
  (<T>(schema: Schema) => TypedCompilationResult<T>) &
  ((schema: Schema) => CompilationResult);
