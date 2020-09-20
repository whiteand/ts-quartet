/* tslint:disable:object-literal-sort-keys */
import { IExplanation } from "../../explanations";
import { CompilationResult, TSchema, Validator } from "../../types";
import { validate } from "./validate";

export function eCompileSchema<T = any>(
  schema: TSchema
): CompilationResult<T, any> {
  const explanations: any[] = [];
  function validator(value: any) {
    ((validator as unknown) as CompilationResult<
      T,
      IExplanation
    >).explanations = [];

    return validate(
      value,
      schema,
      [],
      ((validator as unknown) as CompilationResult<T, IExplanation>)
        .explanations
    );
  }
  return Object.assign(validator as Validator<T>, { explanations });
}
