import { compileAnd } from './compileAnd'
import { compileConstant } from './compileConstant'
import { compileFunctionSchemaResult } from './compileFunctionSchemaResult'
import { compileObjectSchema } from './compileObjectSchema'
import { compileObjectSchemaWithRest } from './compileObjectSchemaWithRest'
import { compileVariants } from './compileVariants'
import { handleSchema } from './handleSchema'
import {
  CompilationResult,
  IPureCompileConfig,
  ISettings,
  QuartetInstance,
  Schema,
} from './types'

export const getPureCompile = ({ errorBoundary }: ISettings) =>
  function pureCompile(
    this: QuartetInstance,
    s: Schema,
    config?: IPureCompileConfig,
  ): CompilationResult {
    if (errorBoundary && (!config || !config.ignoreGlobalErrorBoundary)) {
      s = handleSchema<Schema>({
        and: andSchema => this.errorBoundary(andSchema, errorBoundary),
        constant: constantSchema => this.errorBoundary(constantSchema, errorBoundary),
        function: functionSchema =>
          functionSchema().handleError
            ? functionSchema
            : this.errorBoundary(functionSchema, errorBoundary),
        object: objectSchema => this.errorBoundary(objectSchema, errorBoundary),
        pair: pairSchema => this.errorBoundary(pairSchema, errorBoundary),
        objectRest: objectRestSchema =>
          this.errorBoundary(objectRestSchema, errorBoundary),
        variant: variantSchema => this.errorBoundary(variantSchema, errorBoundary),
      })(s)
    }
    const validator = handleSchema<CompilationResult>({
      // TODO: Check if appropriate
      and: andSchema => compileAnd(this, andSchema.slice(1)),
      constant: constant => compileConstant(this, constant),
      function: funcSchema => compileFunctionSchemaResult(this, funcSchema()),
      object: objSchema => compileObjectSchema(this, objSchema),
      objectRest: objSchema => compileObjectSchemaWithRest(this, objSchema),
      variant: schemas => compileVariants(this, schemas),
      pair: pairSchema => {
        throw new Error('Wrong usage of v.pair')
      },
    })(s)

    return validator as any
  }
