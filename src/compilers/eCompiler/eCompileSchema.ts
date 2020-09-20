/* tslint:disable:object-literal-sort-keys */
import { IExplanation } from "../../explanations";
import { CompilationResult, TSchema, Validator } from "../../types";
import { explanation } from "./explanation";
import { getExplanator } from "./getExplanator";
import { validate } from "./validate";

export function eCompileSchema<T = any>(
  schema: TSchema
): CompilationResult<T, any> {
  const explanator: (value: any) => null | IExplanation[] = getExplanator(
    schema
  );

  function validator(value: any) {
    const explanationsOrNull = explanator(value);
    if (explanationsOrNull) {
      ((validator as unknown) as CompilationResult<
        T,
        IExplanation
      >).explanations = explanationsOrNull;
      return false;
    } else {
      ((validator as unknown) as CompilationResult<
        T,
        IExplanation
      >).explanations = [];
      return true;
    }
  }

  return Object.assign(validator as Validator<T>, { explanations });
}
