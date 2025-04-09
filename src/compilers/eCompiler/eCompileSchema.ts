/* tslint:disable:object-literal-sort-keys */
import { IExplanation } from "../../explanations";
import { Z } from "../../types";
import { CompilationResult, TSchema, Validator } from "../../types";
import { getExplanator } from "./getExplanator";

export function eCompileSchema<T = Z>(
  schema: TSchema
): CompilationResult<T, Z> {
  const explanator: (
    value: Z,
    path: KeyType[]
  ) => null | IExplanation[] = getExplanator(schema);
  const explanations: IExplanation[] = [];
  function validator(value: Z) {
    const explanationsOrNull = explanator(value, []);
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

  return Object.assign(validator as Validator<T>, {
    explanations,
    schema,
    cast() {
      return this as Z;
    },
  });
}
