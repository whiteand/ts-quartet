import { SchemaType } from './SchemaType'

type RendererMethod<R = string, S = any> = (
  valueId: string,
  // id that is ready to be used in expression for reading
  schema: S,
  // function that is used to allocate place to do something, returns id that is ready to be used for reading and writing
  alloc: (initialValue?: any, prefix?: string) => string,
  // id of array that is ready to be used in expression for reading
  pathToValueId: string,
  // id of array that is ready to be used for reading and writing
  explanationsArrId: string,
) => R

export interface ISchemaRenderer<S = any> {
  getExpr: RendererMethod<string, S>
  getNotExpr: RendererMethod<string, S>
  getIfNotExprReturnFalse: RendererMethod<string, S>
  getIfExprReturnTrue: RendererMethod<string, S>
}

export type TPrimitiveSchema = null | undefined | boolean | symbol | string | number

export type AndSchema = {
  type: SchemaType.And
  schemas: TSchema[]
}

export type ArraySchema = {
  type: SchemaType.Array
}

export type ArrayOfSchema = {
  type: SchemaType.ArrayOf
  elementSchema: TSchema
}

export type BooleanSchema = {
  type: SchemaType.Boolean
}

export type FiniteSchema = {
  type: SchemaType.Finite
}

export type FunctionSchema = {
  type: SchemaType.Finite
}
export type MaxSchema = {
  type: SchemaType.Max
  maxValue: number
  isExclusive: boolean
}

export type MaxLengthSchema = {
  type: SchemaType.MaxLength
  maxLength: number
  isExclusive: boolean
}
export type MinSchema = {
  type: SchemaType.Min
  minValue: number
  isExclusive: boolean
}

export type MinLengthSchema = {
  type: SchemaType.MinLength
  minLength: number
  isExclusive: boolean
}

export type NegativeSchema = {
  type: SchemaType.Negative
}
export type NotSchema = {
  type: SchemaType.Not
  schema: TSchema
}

export type NumberSchema = {
  type: SchemaType.Number
}

export type ObjectSchema = {
  [key: string]: TSchema
}

export type TNonPrimitiveSchema = AndSchema | ArraySchema | ArrayOfSchema

export type TSchema = TNonPrimitiveSchema | TPrimitiveSchema
