import { CompilationResult } from '../types'

export function getExplanations<E>(
  validator: CompilationResult<any, E>,
  value: any,
): E[] {
  if (validator(value)) {
    throw new Error('valid value' + JSON.stringify(value))
  }
  return validator.explanations
}
