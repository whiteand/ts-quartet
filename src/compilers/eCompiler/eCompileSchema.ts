/* tslint:disable:object-literal-sort-keys */
import { IExplanation } from '../../explanations'
import { CompilationResult, TSchema, Validator } from '../../types'
import { getExplanator } from './getExplanator'

export function eCompileSchema<T = any>(schema: TSchema): CompilationResult<T, any> {
  const explanator: (
    value: any,
    path: KeyType[],
  ) => null | IExplanation[] = getExplanator(schema)
  const explanations: IExplanation[] = []
  function validator(value: any) {
    const explanationsOrNull = explanator(value, [])
    if (explanationsOrNull) {
      ;((validator as unknown) as CompilationResult<
        T,
        IExplanation
      >).explanations = explanationsOrNull
      return false
    } else {
      ;((validator as unknown) as CompilationResult<T, IExplanation>).explanations = []
      return true
    }
  }

  return Object.assign(validator as Validator<T>, { explanations })
}
