import { IMethods } from "./methods";
export interface IKeyParentSchema {
  key: any;
  parent: any;
  schema: any;
}

export type TypeGuardValidator<T = any> = (
  value: any,
  explanations?: any[],
  parents?: IKeyParentSchema[]
) => value is T;

export type Validator = (
  value: any,
  explanations: any[],
  parents: IKeyParentSchema[]
) => boolean;

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

type QuartetInstance = (<T = any>(
  schema?: Schema,
  explanation?: Explanation,
  innerSettings?: InstanceSettings
) => TypeGuardValidator<T>) &
  IMethods;
