import { IMethods } from "./methods";

export interface IKeyParentSchema {
  key: any;
  parent: any;
  schema: any;
}

export type Validator = (
  value: any,
  explanations?: any[],
  parents?: IKeyParentSchema[]
) => boolean;

export type ValidatorWithSchema = Validator & { schema: Schema };

export interface IObjectSchema {
  [key: string]: Schema;
}

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

export type InstanceSettings = Partial<{
  defaultExplanation: Explanation;
  allErrors: boolean;
}>;

export type CompilerFunction = (
  schema?: Schema,
  explanation?: Explanation,
  innerSettings?: InstanceSettings
) => Validator;

export type GetFromSettings<T = Validator> = (settings: InstanceSettings) => T

export type QuartetInstance = CompilerFunction & IMethods & { rest: string };
