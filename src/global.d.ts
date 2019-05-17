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
  | null
  | number
  | string
  | symbol
  | undefined
  | boolean
  | Validator
  | IVariantSchema
  | IObjectSchema;
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
  onInvalid: FromValidationParams;
  onValid: FromValidationParams;
  allErrors: boolean;
}>;

export type QuartetInstance = ((
  schema?: Schema,
  explanation?: Explanation,
  innerSettings?: InstanceSettings
) => Validator) &
  IMethods;
