export type Context = {
  explanations: any[];
  [key: string]: any;
};
export type Prepare = (ctx: Context) => void;
export type HandleError = (valueId: string, ctxId: string) => string;
export type FunctionSchemaResult = {
  prepare?: Prepare;
  check: (valueId: string, ctxId: string) => string;
  handleError?: HandleError;
  not?: (valudId: string, ctxId: string) => string;
};

export type FunctionSchema = () => FunctionSchemaResult;

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
export interface HandleSchemaHandlers<R> {
  function: HandleSchemaHandler<FunctionSchema, R>;
  constant: HandleSchemaHandler<ConstantSchema, R>;
  objectRest: HandleSchemaHandler<IObjectSchema, R>;
  object: HandleSchemaHandler<IObjectSchema, R>;
  variant: HandleSchemaHandler<IVariantSchema, R>;
}

export interface IMethods {
  string: FunctionSchema;
  number: FunctionSchema;
  safeInteger: FunctionSchema;
  rest: string;
}

type TypedCompilationResult<T> = ((value: any) => value is T) & Context;
export type CompilationResult = ((value: any) => boolean) & Context;
export type QuartetInstance = IMethods &
  (<T>(schema: Schema) => TypedCompilationResult<T>) &
  ((schema: Schema) => CompilationResult);
