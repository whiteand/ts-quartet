import { IMethods } from "./methods";

export interface IKeyParentSchema {
  key: any;
  parent: any;
  schema: any;
}

export type Validator = (
  value?: any,
  explanations?: any[],
  parents?: IKeyParentSchema[]
) => boolean;

export type ValidatorWithSchema<T = Schema> = Validator & { schema: T };

export interface ITest {
  test: (value: any) => boolean;
}

export interface IObjectSchema {
  [key: string]: Schema;
}

export type TypeGuardValidator<T = any> = (
  value: any,
  explanations?: any[],
  parents?: IKeyParentSchema[]
) => value is T;

export type Schema =
  | boolean
  | null
  | number
  | string
  | symbol
  | undefined
  | IObjectSchema
  | IVariantSchema
  | Validator;

export interface IVariantSchema extends Array<Schema> {}

export type FromValidationParams<T = any> = (
  value: any,
  schema: Schema,
  settings: InstanceSettings,
  parents?: IKeyParentSchema[]
) => T;
export type Explanation<T = any> = T | FromValidationParams<T>;

export interface IDictionary<T = any> {
  [key: string]: T;
}

export type InstanceSettings = Partial<{
  defaultExplanation: Explanation;
  allErrors: boolean;
}>;

export type CompilerFunction = <T = any>(
  schema?: Schema,
  explanation?: Explanation,
  innerSettings?: InstanceSettings
) => TypeGuardValidator<T>;

export type GetFromSettings<T = Validator> = (settings: InstanceSettings) => T;

export type Quartet = (settings?: InstanceSettings) => QuartetInstance;

export type QuartetInstance = CompilerFunction &
  IMethods & { rest: string; settings: InstanceSettings };
